import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ErrorState from '../../components/ErrorState/ErrorState'
import Loader from '../../components/Loader/Loader'
import LoaderOverlay from '../../components/LoaderOverlay/LoaderOverlay'
import FormActions from '../../components/FormActions/FormActions'
import { useToast } from '../../components/Toast/ToastProvider'
import type { FaqItemDto } from '@types'
import { getFaqs, saveFaqs } from './api'
import FaqRow, { type IFaqRowErrors } from './FaqRow'
import styles from './Faq.module.scss'

interface NewItemDto extends Omit<FaqItemDto, 'id'> {
  fakeId: number
}

const getItemId = (item: FaqItemDto | NewItemDto) => ('id' in item ? item.id : item.fakeId)

const Faq = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['faq'],
    queryFn: getFaqs,
    select: (data) => data.data,
  })

  const { notify } = useToast()
  const [items, setItems] = useState<(FaqItemDto | NewItemDto)[]>([])
  const [syncedData, setSyncedData] = useState(data)
  const [errors, setErrors] = useState<Record<number, IFaqRowErrors>>({})
  const [enteringId, setEnteringId] = useState<number | null>(null)

  const mutate = useMutation({
    mutationFn: () =>
      saveFaqs(
        items.map(({ title, description, ...item }) => ({
          title,
          description,
          ...('id' in item ? { id: item.id } : {}),
        })),
      ),
    onSuccess: () => notify('success', 'Изменения сохранены'),
    onError: (error) => notify('error', error.message),
  })

  if (data !== syncedData) {
    setSyncedData(data)
    setItems(data ?? [])
  }

  if (isLoading) return <Loader />
  if (error) return <ErrorState message={error.message} />

  const handleChange = (id: number, patch: Partial<FaqItemDto>) => {
    setItems((prev) => prev.map((item) =>
      (('id' in item ? item.id : item.fakeId) === id ? { ...item, ...patch } : item)))
    setErrors((prev) => {
      if (!prev[id]) return prev
      const fieldErrors = { ...prev[id] }
      if ('title' in patch) delete fieldErrors.title
      if ('description' in patch) delete fieldErrors.description
      const next = { ...prev }
      if (Object.keys(fieldErrors).length === 0) {
        delete next[id]
      } else {
        next[id] = fieldErrors
      }
      return next
    })
  }

  const handleAdd = () => {
    const fakeId = Date.now()
    setItems((prev) => [...prev, { fakeId, title: '', description: '' }])
    setEnteringId(fakeId)
  }

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => 'id' in item ? item.id : item.fakeId !== id))
    setErrors((prev) => {
      if (!(id in prev)) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    if (hoverIndex < 0 || hoverIndex >= items.length) return
    setItems((prev) => {
      const next = [...prev]
      const [dragged] = next.splice(dragIndex, 1)
      next.splice(hoverIndex, 0, dragged)
      return next
    })
  }

  const handleSave = () => {
    const nextErrors: Record<number, IFaqRowErrors> = {}
    items.forEach((item) => {
      const fieldErrors: IFaqRowErrors = {}
      if (!item.title.trim()) fieldErrors.title = true
      if (!item.description.trim()) fieldErrors.description = true
      if (Object.keys(fieldErrors).length > 0) nextErrors[getItemId(item)] = fieldErrors
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('error', 'Заполните обязательные поля перед сохранением')
      return
    }
    mutate.mutate()
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Вопросы</h1>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>Пока нет ни одного вопроса</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {items.map((item, index) => {
              const id = getItemId(item)
              return (
                <FaqRow
                  key={id}
                  item={item}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  isEntering={id === enteringId}
                  errors={errors[id]}
                  moveRow={moveRow}
                  onChange={handleChange}
                  onDeleteRequest={() => handleDelete(id)}
                  onEnterAnimationEnd={() => setEnteringId(null)}
                />
              )
            })}
          </ul>
        )}
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAdd}
          disabled={mutate.isPending}
        >
          + Добавить вопрос
        </button>
        <FormActions onSave={handleSave} disabled={mutate.isPending} />
      </div>
      {mutate.isPending && <LoaderOverlay />}
    </DndProvider>
  )
}

export default Faq
