import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { PUBLIC_KEY } from 'src/constants/key-decorators';
import { UsersService } from 'src/users/services/users.service';
import { useToken } from 'src/utils/use.token';
import { IUseToken } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector, // leer atributos de decoradores
  ) {}

  async canActivate(context: ExecutionContext) {
    // 1. Leer Decorador @Public. Si existe, retorna true
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(), // leer el decorador de la ruta
    );
    if (isPublic) return true;

    // 2. Leer el token
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Token not found');
    }

    //3. Validar token
    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === 'string')
      throw new UnauthorizedException(manageToken);

    if (manageToken.isExpired)
      throw new UnauthorizedException('Token is expired');

    //4. Buscar el usuario
    const user = await this.userService.findUserById(manageToken.sub);
    if (!user) throw new UnauthorizedException('Invalid User');

    //5. Guardar el usuario en el request
    request.idUser = user.id;
    request.roleUser = user.role;

    return true;
  }
}
