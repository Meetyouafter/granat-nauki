import { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import classNames from 'classnames'

import { type FaqItem, type FaqItemDto, getFaqItemId } from '@entities/faq'

import { ConfirmModal } from '@shared/ui/ConfirmModal'
import { StatusBadge } from '@shared/ui/StatusBadge'

import type { IFaqRowErrors } from '../model/types'

import styles from './FaqRow.module.scss'

const ROW_TYPE = 'FAQ_ROW'

interface IDragItem {
  index: number
  moved: boolean
}

interface IFaqRow {
  item: FaqItem
  index: number
  isFirst: boolean
  isLast: boolean
  isEntering?: boolean
  errors?: IFaqRowErrors
  moveRow: (dragIndex: number, hoverIndex: number) => void
  onChange: (id: number, patch: Partial<FaqItemDto>) => void
  onDeleteRequest: () => void
  onEnterAnimationEnd?: () => void
}

function FaqRow({
  item,
  index,
  isFirst,
  isLast,
  isEntering = false,
  errors,
  moveRow,
  onChange,
  onDeleteRequest,
  onEnterAnimationEnd,
}: IFaqRow) {
  const ref = useRef<HTMLLIElement>(null)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const id = getFaqItemId(item)

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

  const handleDeleteConfirm = () => {
    setIsConfirmingDelete(false)
    onDeleteRequest()
  }

  return (
    <li
      ref={ref}
      className={classNames(styles.row, isDragging && styles.dragging, isOver && styles.over)}
      data-entering={isEntering || undefined}
      onAnimationEnd={isEntering ? onEnterAnimationEnd : undefined}
    >
      <div className={styles.dragControls}>
        <span className={styles.handle} aria-hidden="true">
          ⠿
        </span>
        <button
          type="button"
          className={styles.reorder}
          onClick={() => moveRow(index, index - 1)}
          disabled={isFirst}
          aria-label={`Переместить вопрос №${index + 1} вверх`}
        >
          ▲
        </button>
        <button
          type="button"
          className={styles.reorder}
          onClick={() => moveRow(index, index + 1)}
          disabled={isLast}
          aria-label={`Переместить вопрос №${index + 1} вниз`}
        >
          ▼
        </button>
      </div>
      <div className={styles.fields}>
        <input
          className={classNames(styles.field, styles.title, errors?.title && styles.fieldInvalid)}
          value={item.title}
          onChange={(event) => onChange(id, { title: event.target.value })}
          placeholder="Заголовок вопроса"
          aria-label={`Заголовок вопроса №${index + 1}`}
          aria-invalid={errors?.title || undefined}
        />
        {errors?.title && <span className={styles.fieldError}>Заполните заголовок</span>}
        <textarea
          className={classNames(
            styles.field,
            styles.description,
            errors?.description && styles.fieldInvalid,
          )}
          value={item.description}
          onChange={(event) => onChange(id, { description: event.target.value })}
          placeholder="Описание ответа"
          aria-label={`Описание ответа №${index + 1}`}
          aria-invalid={errors?.description || undefined}
          rows={2}
        />
        {errors?.description && <span className={styles.fieldError}>Заполните описание</span>}
        {'id' in item && item.translationStatus && (
          <div className={styles.statuses}>
            <StatusBadge status={item.translationStatus} />
          </div>
        )}
      </div>
      <button
        type="button"
        className={styles.delete}
        onClick={() => setIsConfirmingDelete(true)}
        aria-label="Удалить вопрос"
      >
        ✕
      </button>
      {isConfirmingDelete && (
        <ConfirmModal
          title="Удалить вопрос?"
          message="Вопрос будет удалён без возможности отмены"
          confirmLabel="Удалить"
          cancelLabel="Отмена"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </li>
  )
}

export default FaqRow
