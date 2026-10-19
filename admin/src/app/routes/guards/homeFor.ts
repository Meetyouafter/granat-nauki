import type { Role } from '@granat/contracts';

import { paths } from '@shared/config';

/** Куда отправить пользователя, которому сюда нельзя: админа на главную, USER на запрос прав. */
export const homeFor = (role: Role) => role === 'ADMIN'
  ? paths.home
  : paths.accessRights;
