import { SetMetadata } from '@nestjs/common';
import { ACCESS_LEVEL_KEY } from 'src/constants/key-decorators';

/*
 El SetMetadata es un decorador que permite establecer metadatos en una función.
 retorna dos cosas, una firma y u valor.
 En este caso lo vamos a usar para la guard. el cual lee booleanos.
 Asi que este decorador es para las rutas publicas.
 Retornara true.

*/
export const AccessLevel = (level: number) =>
  SetMetadata(ACCESS_LEVEL_KEY, level);
