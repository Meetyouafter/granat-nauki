import { useState } from 'react'
import { useNavigate } from 'react-router'

import { paths } from '@shared/config'

import styles from './LoginPage.module.scss'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    navigate(paths.home)
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Вход</h1>
        <label className={styles.field}>
          <span className={styles.label}>Почта</span>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Пароль</span>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
        <button type="submit" className={styles.submit}>
          Войти
        </button>
      </form>
    </div>
  )
}

export default LoginPage
