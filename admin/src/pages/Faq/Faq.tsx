import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ErrorState from '../../components/ErrorState/ErrorState'
import Loader from '../../components/Loader/Loader'
import FormActions from '../../components/FormActions/FormActions'
import { useToast } from '../../components/Toast/ToastProvider'
import type { FaqItemDto } from '@types'
import { getFaqs, saveFaqs } from './api'
import FaqRow from './FaqRow'
import styles from './Faq.module.scss'

interface NewItemDto extends Omit<FaqItemDto, 'id'> {
  fakeId: number 
}

const Faq = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['faq'],
    queryFn: getFaqs,
    select: (data) => data.data,
  })

  const { notify } = useToast()
  const [items, setItems] = useState<(FaqItemDto | NewItemDto)[]>([])
  const [syncedData, setSyncedData] = useState(data)

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
  }

  const handleAdd = () => {
    setItems((prev) => [...prev, { fakeId: Date.now(), title: '', description: '' }])
  }

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => 'id' in item ? item.id : item.fakeId !== id))
  }

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    setItems((prev) => {
      const next = [...prev]
      const [dragged] = next.splice(dragIndex, 1)
      next.splice(hoverIndex, 0, dragged)
      return next
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Вопросы</h1>
        <ul className={styles.list}>
          {items.map((item, index) => (
            <FaqRow
              key={'id' in item ? item.id : item.fakeId}
              item={item}
              index={index}
              moveRow={moveRow}
              onChange={handleChange}
              onDeleteRequest={() => handleDelete('id' in item ? item.id : item.fakeId)}
            />
          ))}
        </ul>
        <button type="button" className={styles.addButton} onClick={handleAdd}>
          + Добавить вопрос
        </button>
        <FormActions onSave={() => mutate.mutate()} />
      </div>
    </DndProvider>
  )
}

export default Faq
