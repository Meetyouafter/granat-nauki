import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { FaqRow, type IFaqRowErrors } from '@features/faq-editor'

import { type FaqItem, type FaqItemDto, getFaqItemId } from '@entities/faq'

// import { ErrorState } from '@shared/ui/ErrorState'
import { FormActions } from '@shared/ui/FormActions'
import { Loader } from '@shared/ui/Loader'
import { LoaderOverlay } from '@shared/ui/LoaderOverlay'
import { useToast } from '@shared/ui/Toast'

import styles from './FaqPage.module.scss'

const FaqPage = () => {
  const data: [] = []
  const isLoading = false
  // const error: null = null
  // TODO: заменить на состояние мутации, когда появится API FAQ
  const isSaving = false

  const { notify } = useToast()
  const [items, setItems] = useState<FaqItem[]>([])
  const [syncedData, setSyncedData] = useState(data)
  const [errors, setErrors] = useState<Record<number, IFaqRowErrors>>({})
  const [enteringId, setEnteringId] = useState<number | null>(null)

  if (data !== syncedData) {
    setSyncedData(data)
    setItems(data ?? [])
  }

  if (isLoading) return <Loader />
  // if (error) return <ErrorState message={error.message} />

  const handleChange = (id: number, patch: Partial<FaqItemDto>) => {
    setItems((prev) =>
      prev.map((item) => (getFaqItemId(item) === id ? { ...item, ...patch } : item)))
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
    setItems((prev) => prev.filter((item) => ('id' in item ? item.id : item.fakeId !== id)))
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
      if (Object.keys(fieldErrors).length > 0) nextErrors[getFaqItemId(item)] = fieldErrors
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      notify('error', 'Заполните обязательные поля перед сохранением')
      return
    }

    // TODO: отправить items, когда появится API FAQ
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
              const id = getFaqItemId(item)
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
          disabled={isSaving}
        >
          + Добавить вопрос
        </button>
        <FormActions onSave={handleSave} disabled={isSaving} />
      </div>
      {isSaving && <LoaderOverlay />}
    </DndProvider>
  )
}

export default FaqPage
