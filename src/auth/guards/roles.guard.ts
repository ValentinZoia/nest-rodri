import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorators';
import { ROLES } from 'src/constants/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, // leer atributos de decoradores
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Leer Decorador @Public. Si existe, retorna true
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(), // leer el decorador de la ruta
    );
    if (isPublic) return true;

    // 2. Leer Decorador @Roles
    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(), // leer el decorador de la ruta
    );

    //Leer Decorador @Admin
    const admin = this.reflector.get<string>(
      ADMIN_KEY,
      context.getHandler(), // leer el decorador de la ruta
    );

    // 3. Leer el token
    const request = context.switchToHttp().getRequest<Request>();

    // 4. Extraer el rol del usuario logeado
    const { roleUser } = request;

    //si soy admin paso siempre padre
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (roleUser === ROLES.ADMIN) return true;

    //si yo no especifique roles en el endpoint
    if (roles === undefined) {
      //si yo no especifique que es solo para admins
      if (admin === undefined) {
        //te dejo pasar
        return true;
      }
      //si el endpoint es solo para admins, y vos sos uno
      else if (admin && roleUser === admin) {
        //te dejo pasar
        return true;
      }
      //si el endpoint es solo para admins, y vos no sos uno
      else {
        //no te dejo pasar
        throw new UnauthorizedException("You don't have permission");
      }
    }

    //si el endpoint tiene especificado algun rol, verifico si sos ese rol
    const isAuth = roles.some((role) => role === roleUser);

    //si no sos ese rol especifico del endpoint
    if (!isAuth) {
      //no te dejo pasar
      throw new UnauthorizedException("You don't have permission");
    }

    return true;
  }
}
