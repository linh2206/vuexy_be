import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountRepository } from '~/database/typeorm/repositories/account.repository';
import { TokenService } from '~/shared/services';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ObjectId } from 'mongodb';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly accountRepository: AccountRepository, private readonly tokenService: TokenService) {}

    async findOne(id: string) {
        console.log("🚀 ~ ProfileService ~ findOne ~ id:", id)
        return await this.accountRepository.findOne({
            // select: ['email', 'username', 'description'],
            where: { _id: new ObjectId(id) },
        });
    }

    update(id: string, updateProfileDto: UpdateProfileDto) {
        return this.accountRepository.update({ _id: new ObjectId(id) }, updateProfileDto);
    }

    async resetPassword(id: string, resetPasswordDto: ResetPasswordDto) {
        const account = await this.accountRepository.findOne({ where: { _id: new ObjectId(id) } });

        const { salt, hash } = this.tokenService.hashPassword(resetPasswordDto.password);
        const res = await this.accountRepository.update(
            { _id: new ObjectId(id) },
            {
                password: hash,
                salt,
            },
        );

        return res;
    }

    async changePassword(id: string, updateProfileDto: ChangePasswordDto) {
        if (updateProfileDto.new_password !== updateProfileDto.confirm_password) {
            throw new BadRequestException('The new password does not match');
        }
        const account = await this.accountRepository.findOne({ where: { _id: new ObjectId(id) } });
        const isMatch = await this.tokenService.isPasswordCorrect(updateProfileDto.old_password, account.password);
        if (!isMatch) {
            throw new BadRequestException('Old password is incorrect');
        }

        const { salt, hash } = this.tokenService.hashPassword(updateProfileDto.new_password);
        const res = await this.accountRepository.update(
            { _id: new ObjectId(id) },
            {
                password: hash,
                salt,
            },
        );

        return res;
    }
}
