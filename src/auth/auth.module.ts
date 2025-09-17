import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from 'src/users/users.module';
import { BcryptAdapter } from 'src/utils/bcrypt.adapter';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    UsersService,
    {
      provide: 'CompareFunction',
      // eslint-disable-next-line @typescript-eslint/unbound-method
      useValue: BcryptAdapter.compare,
    },
    {
      provide: 'HashFunction',
      // eslint-disable-next-line @typescript-eslint/unbound-method
      useValue: BcryptAdapter.hash,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
