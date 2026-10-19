import { useState } from 'react';

import classNames from 'classnames';

import { type IInput, Input } from '../Field';
import { EyeIcon } from '../icons';

import styles from './PasswordInput.module.scss';

type IPasswordInput = Omit<IInput, 'type'>;

const PasswordInput = ({ className, ...props }: IPasswordInput) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Input
        {...props}
        type={isVisible ? 'text' : 'password'}
        className={classNames(styles.input, className)}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => { setIsVisible(prev => !prev); }}
        aria-label={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
        aria-pressed={isVisible}
      >
        <EyeIcon isCrossed={isVisible} />
      </button>
    </div>
  );
};

export default PasswordInput;
