import { useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import classNames from 'classnames'
import type { FaqItemDto } from '@types'
import styles from './FaqRow.module.scss'

const ROW_TYPE = 'FAQ_ROW'

interface IDragItem {
  index: number
  moved: boolean
}

interface NewItemDto extends Omit<FaqItemDto, 'id'> {
  fakeId: number 
}

interface IFaqRow {
  item: FaqItemDto | NewItemDto
  index: number
  moveRow: (dragIndex: number, hoverIndex: number) => void
  onChange: (id: number, patch: Partial<FaqItemDto>) => void
  onDeleteRequest: () => void
}

function FaqRow({
  item,
  index,
  moveRow,
  onChange,
  onDeleteRequest,
}: IFaqRow) {
  const ref = useRef<HTMLLIElement>(null)

  const id = 'id' in item ? item.id : item.fakeId

  const [{ isDragging }, drag] = useDrag({
    type: ROW_TYPE,
    item: (): IDragItem => ({ index, moved: false }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })

  const [{ isOver }, drop] = useDrop<IDragItem, void, { isOver: boolean }>({
    accept: ROW_TYPE,
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    hover: (draggedItem) => {
      if (draggedItem.index === index) return
      moveRow(draggedItem.index, index)
      draggedItem.index = index
      draggedItem.moved = true
    },
  })

  useEffect(() => {
    drag(drop(ref))
  }, [drag, drop])

  return (
    <li
      ref={ref}
      className={classNames(styles.row, isDragging && styles.dragging, isOver && styles.over)}
    >
      <span className={styles.handle} aria-hidden="true">
        ⠿
      </span>
      <div className={styles.fields}>
        <input
          className={classNames(styles.field, styles.title)}
          value={item.title}
          onChange={(event) => onChange(id, { title: event.target.value })}
          placeholder="Заголовок вопроса"
        />
        <textarea
          className={classNames(styles.field, styles.description)}
          value={item.description}
          onChange={(event) => onChange(id, { description: event.target.value })}
          placeholder="Описание ответа"
          rows={2}
        />
      </div>
      <button
        type="button"
        className={styles.delete}
        onClick={onDeleteRequest}
        aria-label="Удалить вопрос"
      >
        ✕
      </button>
    </li>
  )
}

export default FaqRow
