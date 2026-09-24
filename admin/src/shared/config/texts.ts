import { MIN_PASSWORD_LENGTH } from "./constants"

export const FORM_TEXTS = {
  signup: {
    title: 'Регистрация',
    button: 'Зарегистрироваться',
    switchQuestion: 'Уже есть аккаунт?',
    switchLink: 'Войти',
  },
  signin: {
    title: 'Вход',
    button: 'Войти',
    switchQuestion: 'Ещё нет аккаунта?',
    switchLink: 'Зарегистрироваться',
  },
  email: {
    label: 'Почта',
    placeholder: 'you@example.com',
    emptyError: 'Введите вашу почту',
    matchError: 'Неверный формат. Проверьте введённые данные',
  },
  password: {
    label: 'Пароль',
    placeholder: '••••••••',
    emptyError: 'Введите пароль',
    lengthError: `Пароль не должен быть короче ${MIN_PASSWORD_LENGTH} символов`,
  }
} as const
