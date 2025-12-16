'use client';

import { useState } from 'react';
import styles from './ReviewForm.module.scss';

const ReviewForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className={styles.toggleButton}
      >
        {isOpen ? 'Скрыть форму' : 'Оставить отзыв'}
      </button>
      
      {isOpen && (
        <form action="#" method="post" className={styles.form}>
          <label>
            Имя (опционально)
            <input name="name" placeholder="Например, Анна" className={styles.input} />
          </label>
          <label>
            Отзыв
            <textarea name="text" placeholder="Ваши впечатления" rows={6} className={styles.textarea} />
          </label>
          <button type="submit" className={styles.submit}>Отправить</button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;


