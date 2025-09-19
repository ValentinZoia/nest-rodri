import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ACCESS_LEVEL_KEY, PUBLIC_KEY } from 'src/constants/key-decorators';
import { ACCESS_LEVEL, ROLES } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
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

    // 2. Leer Decorador @AccessLevel
    const accessLevel = this.reflector.get<keyof typeof ACCESS_LEVEL>(
      ACCESS_LEVEL_KEY,
      context.getHandler(), // leer el decorador de la ruta
    );

    // 3. Leer el token
    const request = context.switchToHttp().getRequest<Request>();

    const { roleUser, idUser } = request;

    //si soy admin o creador paso siempre
    if (ROLES[roleUser] === ROLES.ADMIN || ROLES[roleUser] === ROLES.CREATOR)
      return true;

    const user = await this.userService.findUserById(idUser);

    /*
      esta guarda se aplica a los endpoints de projectos.
      lo que verifico abajo es si la persona que esta logeada en la app (idUser)
      esta incluida en el proyecto el cual se esta accediendo (request.params.projectId)
    */
    const userExistsInProject = user.projectsInclude.find(
      (project) => project.project.id === request.params.projectId,
    );

    //si la persona no esta incluida en el proyecto, no lo dejo acceder
    if (userExistsInProject === undefined)
      throw new UnauthorizedException("You don't belong to this project");

    //con el decorador @AccessLevel verifico si el nivel de acceso del usuario es suficiente para acceder al endpoint
    if (ACCESS_LEVEL[accessLevel] > userExistsInProject.accessLevel) {
      throw new UnauthorizedException(
        "You don't have the necessary access level for this endpoint",
      );
    }
    return true;
  }
}
