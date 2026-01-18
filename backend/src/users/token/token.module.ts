import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  imports: [UserModule],
})
export class TokenModule {}
