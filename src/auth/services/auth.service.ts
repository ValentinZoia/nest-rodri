import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { BcryptAdapter } from 'src/utils/bcrypt.adapter';
import { ErrorManager } from 'src/utils/error.manager';
import { JwtAdapter } from 'src/utils/jwt.adapter';
import { PayloadToken } from '../interfaces/auth.interface';
import { UserEntity } from 'src/users/entities/users.entity';
type CompareFunction = (password: string, hashed: string) => boolean;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    @Inject('CompareFunction')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
  ) {}
  public async validateUser(username: string, password: string) {
    try {
      const userByUsername = await this.usersService.findUserBy({
        key: 'username',
        value: username,
      });
      console.log(userByUsername);
      if (userByUsername) {
        const match = this.comparePassword(password, userByUsername.password);

        if (match) return userByUsername;
      }

      const userByEmail = await this.usersService.findUserBy({
        key: 'email',
        value: username,
      });

      if (userByEmail) {
        const match = this.comparePassword(password, userByEmail.password);
        if (match) return userByEmail;
      }

      return null;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async signJWT({
    payload,
    expires,
  }: {
    payload: Record<string, any>;
    secret: string;
    expires: number | string;
  }) {
    return await JwtAdapter.generateToken(payload, true, {
      expiresIn: expires,
    });
  }

  public async generateJWT(
    user: UserEntity,
  ): Promise<{ access_token: string | null; user: UserEntity }> {
    try {
      const getUser = await this.usersService.findUserById(user.id);

      const payload: PayloadToken = {
        sub: getUser.id,
        role: getUser.role,
      };

      return {
        access_token: await this.signJWT({
          payload,
          secret: process.env.JWT_SECRET,
          expires: '5h',
        }),
        user: getUser,
      };
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
