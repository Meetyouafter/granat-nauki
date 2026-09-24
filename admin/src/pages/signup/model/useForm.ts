import { type ChangeEvent, type SubmitEvent, useState } from 'react'
import { useNavigate } from 'react-router'

import { EMAIL_REGEXP, MIN_PASSWORD_LENGTH, paths } from '@shared/config'
import { FORM_TEXTS } from '@shared/config/texts'

const getEmailError = (email: string) => {
  if (!email.length) {
    return FORM_TEXTS.email.emptyError
  } else if (!EMAIL_REGEXP.test(email)) {
    return FORM_TEXTS.email.matchError
  }
  return null
}

const getPasswordError = (password: string) => {
  if (!password.length) {
    return FORM_TEXTS.password.emptyError
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    return FORM_TEXTS.password.lengthError
  }
  return null
}

const useForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string | null>>({
    email: null,
    password: null,
  })

  const navigate = useNavigate()

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, email: null }))
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, password: null }))
    setPassword(event.target.value)
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const emailError = getEmailError(email)
    const passwordError = getPasswordError(password)

    if (emailError || passwordError) {
      setErrors(prev => ({ ...prev, email: emailError, password: passwordError }))
      return
    }

    if (Object.values(errors).every(error => error === null)) {
      navigate(paths.home)
    }
  }

  return {
    email,
    password,
    errors,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  }

}

export default useForm
