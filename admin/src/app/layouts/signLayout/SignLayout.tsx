import { Link, Outlet, useLocation } from 'react-router'

import { FORM_TEXTS, paths } from '@shared/config'

import styles from './SignLayout.module.scss'

const SignLayout = () => {
  const pathname = useLocation().pathname
  const isSignIn = pathname === paths.signin
  const texts = isSignIn ? FORM_TEXTS.signin : FORM_TEXTS.signup

  return (
    <main className={styles.main}>
      <Outlet />
      <p className={styles.footer}>
        {texts.switchQuestion}{' '}
        <Link to={isSignIn ? paths.signup : paths.signin} className={styles.link}>
          {texts.switchLink}
        </Link>
      </p>
    </main>
  )
}

export default SignLayout
