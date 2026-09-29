import 'server-only';
import { hash, type Options, verify } from '@node-rs/argon2';

const MIN_PEPPER_BYTES = 32;

let options: Options | undefined;

const getOptions = (): Options => {
  if (options) return options;

  const pepper = process.env.PASSWORD_PEPPER;
  if (!pepper) throw new Error('PASSWORD_PEPPER is not set');

  const secret = Buffer.from(pepper, 'base64');
  if (secret.length < MIN_PEPPER_BYTES) {
    throw new Error(`PASSWORD_PEPPER must be at least ${MIN_PEPPER_BYTES} bytes`);
  }

  // OWASP minimum for argon2id: m=19 MiB, t=2, p=1
  // параметры определяют стоимость расчета одного хэша
  options = {
    memoryCost: 65536, // сколько памяти занимает один расчёт
    timeCost: 3, // количество проходов алгоритма
    parallelism: 4, // количество потоков для расчета
    outputLen: 32, // итоговая длина хэша в байтах
    secret, // pepper для генерации хэша
  };

  return options;
};

export const hashPassword = (password: string) => hash(password, getOptions());

export const verifyPassword = async (passwordHash: string, password: string) => {
  try {
    return await verify(passwordHash, password, getOptions());
  } catch {
    return false;
  }
};