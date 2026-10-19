import { type ComponentPropsWithoutRef, useState } from 'react';

import classNames from 'classnames';

import EyeIcon from './EyeIcon';

import styles from './PasswordInput.module.scss';

type IPasswordInput = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

const PasswordInput = ({ className, ...props }: IPasswordInput) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.wrapper}>
      <input
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
