import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ErrorState from '../../components/ErrorState/ErrorState'
import Loader from '../../components/Loader/Loader'
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'
import { useToast } from '../../components/Toast/ToastProvider'
import type { FaqItemDto } from '@types'
import { getFaq } from './api'
import FaqRow from './FaqRow'
import styles from './Faq.module.scss'

let nextTempId = -1

function Faq() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['faq'],
    queryFn: getFaq,
    select: (data) => data.data,
  })

  const { notify } = useToast()
  const [items, setItems] = useState<FaqItemDto[]>([])
  const [syncedData, setSyncedData] = useState(data)
  const [pendingDelete, setPendingDelete] = useState<FaqItemDto | null>(null)

  if (data !== syncedData) {
    setSyncedData(data)
    setItems(data ?? [])
  }

  if (isLoading) return <Loader />
  if (error) return <ErrorState message={error.message} />

  const handleChange = (id: number, patch: Partial<FaqItemDto>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const handleFieldCommit = () => {
    notify('success', 'Изменения сохранены')
  }

  const handleDeleteConfirm = () => {
    if (!pendingDelete) return
    setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id))
    notify('success', `Вопрос «${pendingDelete.title}» удалён`)
    setPendingDelete(null)
  }

  const handleAdd = () => {
    setItems((prev) => [...prev, { id: nextTempId--, title: '', description: '' }])
    notify('success', 'Вопрос добавлен')
  }

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    setItems((prev) => {
      const next = [...prev]
      const [dragged] = next.splice(dragIndex, 1)
      next.splice(hoverIndex, 0, dragged)
      return next
    })
  }

  const handleDropRow = () => {
    notify('success', 'Порядок вопросов обновлён')
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Вопросы</h1>
        <ul className={styles.list}>
          {items.map((item, index) => (
            <FaqRow
              key={item.id}
              item={item}
              index={index}
              moveRow={moveRow}
              onDropRow={handleDropRow}
              onChange={handleChange}
              onFieldCommit={handleFieldCommit}
              onDeleteRequest={() => setPendingDelete(item)}
            />
          ))}
        </ul>
        <button type="button" className={styles.addButton} onClick={handleAdd}>
          + Добавить вопрос
        </button>
      </div>
      {pendingDelete && (
        <ConfirmModal
          title="Удалить вопрос?"
          message={`Вы уверены, что хотите удалить вопрос «${pendingDelete.title}»?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </DndProvider>
  )
}

export default Faq
