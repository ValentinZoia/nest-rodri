import { SetMetadata } from '@nestjs/common';
import { ACCESS_LEVEL_KEY } from 'src/constants/key-decorators';
import { ACCESS_LEVEL } from 'src/constants/roles';

/*
 El SetMetadata es un decorador que permite establecer metadatos en una función.
 retorna dos cosas, una firma y u valor.
 En este caso lo vamos a usar para la guard. el cual lee booleanos.
 Asi que este decorador es para las rutas publicas.
 Retornara true.

*/
export const AccessLevel = (level: keyof typeof ACCESS_LEVEL) =>
  SetMetadata(ACCESS_LEVEL_KEY, level);
