import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountRepository } from '~/database/typeorm/repositories/account.repository';
import { TokenService } from '~/shared/services';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly accountRepository: AccountRepository, private readonly tokenService: TokenService) {}

    async findOne(username: string) {
        return await this.accountRepository.findOne({
            // select: ['email', 'username', 'description'],
            where: { username: username },
        });
    }

    update(username: string, updateProfileDto: UpdateProfileDto) {
        console.log('🚀 ~ ProfileService ~ update ~ updateProfileDto:', updateProfileDto);
        return this.accountRepository.update({ username: username }, updateProfileDto);
    }

    async changePassword(username: string, updateProfileDto: ChangePasswordDto) {
        if (updateProfileDto.new_password !== updateProfileDto.confirm_password) {
            throw new BadRequestException('Mật khẩu mới không khớp');
        }
        const account = await this.accountRepository.findOne({ where: { username } });
        const isMatch = await this.tokenService.isPasswordCorrect(updateProfileDto.old_password, account.password);
        if (!isMatch) {
            throw new BadRequestException('Mật khẩu cũ không đúng');
        }

        const { salt, hash } = this.tokenService.hashPassword(updateProfileDto.new_password);
        const res = await this.accountRepository.update(
            { username: username },
            {
                password: hash,
                salt,
            },
        );

        return res;
    }
}
