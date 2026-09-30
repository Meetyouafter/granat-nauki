import { type ChangeEvent, type SubmitEvent, useState } from 'react'
import { useNavigate } from 'react-router'

import { useSigninMutation } from '@shared/api'
import { paths } from '@shared/config'
import { FORM_TEXTS } from '@shared/config/texts'

const getEmailError = (email: string) => {
  if (!email.length) {
    return FORM_TEXTS.email.emptyError
  }
  return null
}

const getPasswordError = (password: string) => {
  if (!password.length) {
    return FORM_TEXTS.password.emptyError
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

  const [signin, { isLoading, error, reset }] = useSigninMutation()
  const navigate = useNavigate()

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, email: null }))
    reset()
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, password: null }))
    reset()
    setPassword(event.target.value)
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const emailError = getEmailError(email)
    const passwordError = getPasswordError(password)

    if (emailError || passwordError) {
      setErrors(prev => ({
        ...prev,
        email: emailError,
        password: passwordError
      }))
      return
    }

    try {
      await signin({ email, password }).unwrap()
      navigate(paths.home)
    } catch {
      //
    }
  }

  console.log(error)
  
  return {
    isLoading,
    email,
    password,
    errors,
    commonError: error,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  }

}

export default useForm
