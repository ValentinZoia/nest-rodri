import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { CreateUserProjectDto } from '../dto/userProject.dto';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';
import { BcryptAdapter } from 'src/utils/bcrypt.adapter';

type HashFunction = (password: string) => string;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UsersProjectsEntity)
    private readonly userProjectRepository: Repository<UsersProjectsEntity>,

    @Inject('HashFunction')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
  ) {}
  async findAllUsers(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findUserById(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .leftJoinAndSelect('user.projectsInclude', 'projectsInclude') //incluir la relación en la respuesta
        .leftJoinAndSelect('projectsInclude.project', 'project') //dentro de la relacion projectInclude, tambien incluir la relacion projecto
        .getOne();

      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'User not found',
        });
      }
      return user;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    try {
      // 1, Validar que el username - email no este en uso
      const userEmailFound = await this.userRepository.findOneBy({
        email: user.email,
      });
      if (userEmailFound) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Email already in use',
        });
      }
      const userUsernameFound = await this.userRepository.findOneBy({
        username: user.username,
      });
      if (userUsernameFound) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Username already in use',
        });
      }

      // 2. Hashear la contraseña
      const hashedPassword = this.hashPassword(user.password);
      if (!hashedPassword) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Error hashing password',
        });
      }
      // 3. Guardar
      const userToSave = { ...user, password: hashedPassword };
      return await this.userRepository.save(userToSave);
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<UpdateResult> {
    try {
      const updatedUser = await this.userRepository.update(id, user);
      if (updatedUser.affected === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User to Update not found',
        });
      return updatedUser;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    try {
      const deletedUser = await this.userRepository.delete(id);
      if (deletedUser.affected === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'User to Delete not found',
        });
      return deletedUser;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async relationToProject(createUserProjectDto: CreateUserProjectDto) {
    try {
      return await this.userProjectRepository.save(createUserProjectDto);
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
