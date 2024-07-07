import { Global, Module } from '@nestjs/common';
import { AccountRepository } from '~/database/typeorm/repositories/account.repository';
import { MailModule } from '~/modules/mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserLogRepository } from '~/database/typeorm/repositories/user-log.repository';
import { GoogleStrategy } from './google.strategy';

@Global()
@Module({
    controllers: [AuthController],
    imports: [MailModule],
    providers: [AuthService, AccountRepository, UserLogRepository, GoogleStrategy],
    exports: [AuthService],
})
export class AuthModule {}
