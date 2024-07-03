import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { TokenService, UtilService } from '@shared/services';
import { AccountRepository } from '~/database/typeorm/repositories/account.repository';
import { MailService } from '~/modules/mail/mail.service';
import { CacheService } from '~/shared/services/cache.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UserLogRepository } from '~/database/typeorm/repositories/user-log.repository';
@Injectable()
export class AuthService {
    private readonly RESETPASSWORDTIMEOUT = 1800000; // miliseconds (30 mins)
    private readonly SECRETKEY = 'sYzB9UTkuLQ0d1DNPZabC4Q29iJ32xGX';
    private readonly INITVECTOR = '3dMYNoQo2CSYDpSD';
    private readonly SECRETSTRING = '6H2su82wAS85KowZ';

    constructor(
        private readonly tokenService: TokenService,
        private readonly mailService: MailService,
        private readonly utilService: UtilService,
        private readonly accountRepository: AccountRepository,
        private readonly userLogRepository: UserLogRepository,
        private readonly cacheService: CacheService,
    ) {}

    private makeText(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    async create(createUserDto: SignUpDto) {
        const { email, password, ...rest } = createUserDto;

        const accountExist = await this.accountRepository.countBy({ email });
        if (accountExist) {
            throw new HttpException('Tài khoản đã tồn tại', 400);
        }

        const { salt, hash } = this.tokenService.hashPassword(createUserDto.password);
        const account = await this.accountRepository.save(
            this.accountRepository.create({
                email: email,
                username: createUserDto.username,
                password: hash,
                description: this.makeText(12),
                salt,
            }),
        );

        if (!account) {
            throw new HttpException('Cannot create account', 400);
        }

        return {
            data: {
                account,
            },
        };
    }

    public async login(data: { email: string; password: string }, userAgent: string, ip: string) {
        try {
            const account = await this.accountRepository.findOne({
                select: ['id', 'email', 'password', 'username'],
                where: {
                    email: data.email,
                },
            });
            if (!account) {
                throw new UnauthorizedException('Wrong username or password');
            }

            if (!this.tokenService.isPasswordCorrect(data.password, account.password)) {
                throw new UnauthorizedException('Wrong username or password');
            }

            const secretToken = this.utilService.generateString();
            const tokenData = this.tokenService.createAuthToken({
                email: data.email,
                username: account.username,
                id: account.id,
                password: account.password,
                secretToken,
            });
            const refreshTokenData = this.tokenService.createRefreshToken({
                email: data.email,
                username: account.username,
                id: account.id,
                password: account.password,
                secretToken,
            });
            this.accountRepository.update(account.id, { secretToken });

            this.cacheService.delete(`account:${account.id}`);

            const log = await this.userLogRepository.save(
                await this.userLogRepository.create({
                    username: account.username,
                    ip: ip,
                    userAgent: userAgent,
                }),
            );
            return {
                result: true,
                message: 'Login successfully',
                data: {
                    id: account.id,
                    session: tokenData.authToken,
                    expired: tokenData.authTokenExpiresIn,
                    refreshToken: refreshTokenData.refreshToken,
                },
            };
        } catch (err) {
            throw new UnauthorizedException('Login error');
        }
    }

    public async logout(data: { session: string }) {
        const user = await this.tokenService.verifyAuthToken({ authToken: data.session });
        if (user.id) {
            const accountId = (await this.accountRepository.findOneBy({ id: user.id })).id;
            if (accountId) {
                this.accountRepository.update(accountId, { secretToken: null });
                this.cacheService.delete(`account:${accountId}`);
            }
        }

        return {
            result: true,
            message: 'Success',
            data: null,
        };
    }

    public async forgotPassword(data: { email: string }) {
        try {
            if (!this.utilService.validateEmail(data.email)) {
                return {
                    result: false,
                    message: 'Email is invalid',
                    data: null,
                };
            }
            const account = await this.accountRepository.findOne({
                select: ['id', 'email', 'password'],
                where: {
                    email: data.email,
                },
            });
            if (!account) {
                return {
                    result: false,
                    message: 'Email does not exist',
                    data: null,
                };
            }
            const encrypted = this.utilService.aesEncrypt({ email: account.email, password: account.password }, this.RESETPASSWORDTIMEOUT);
            const link = `${process.env.FE_URL}/reset-password?token=${encrypted}`;
            // gửi mail link reset password cho user
            this.mailService.sendForgotPassword({
                emailTo: account.email,
                subject: 'Reset your password',
                name: account.username,
                link: link,
            });

            return {
                result: true,
                message: 'Reset-password link has been sent to your email',
                data: null,
            };
        } catch (err) {
            throw new InternalServerErrorException({
                result: false,
                message: 'Forgot password error',
                data: null,
                statusCode: 500,
            });
        }
    }

    public async resetPassword(data: { token: string; password: string }) {
        try {
            const validateToken = this.validateToken(data.token);
            if (!validateToken.result) {
                return {
                    result: false,
                    message: 'Token invalid',
                    data: null,
                };
            }

            const email = validateToken.email;
            const password = validateToken.password;
            const user = await this.accountRepository.findOne({
                select: ['id', 'email'],
                where: { email: email },
            });
            if (!user) {
                return {
                    result: false,
                    message: 'User not found',
                    data: null,
                };
            }

            if (user.password !== password) {
                return {
                    result: false,
                    message: 'Token expired',
                    data: null,
                };
            }

            const { salt, hash } = this.tokenService.hashPassword(data.password);
            const res = await this.accountRepository.update(user.id, {
                password: hash,
                salt,
            });

            return {
                result: res.affected > 0,
                message: res.affected > 0 ? 'Password reset successfully' : 'Cannot reset password',
                data: null,
            };
        } catch (err) {
            throw new InternalServerErrorException({
                result: false,
                message: 'Reset password error',
                data: null,
                statusCode: 500,
            });
        }
    }

    public async renewAuthToken(data: { refreshToken }) {
        const refreshTokenData = this.tokenService.verifyRefreshToken({ refreshToken: data.refreshToken });
        if (!refreshTokenData) {
            return {
                session: null,
                refreshToken: null,
            };
        }

        const authTokenData = this.tokenService.createAuthToken({
            username: refreshTokenData.email,
            email: refreshTokenData.email,
            id: refreshTokenData.id,
            password: refreshTokenData.password,
            secretToken: refreshTokenData.secretToken,
        }).authToken;

        const newRefreshTokenData = this.tokenService.createRefreshToken({
            username: refreshTokenData.email,
            email: refreshTokenData.email,
            id: refreshTokenData.id,
            password: refreshTokenData.password,
            secretToken: refreshTokenData.secretToken,
        });

        return {
            session: authTokenData,
            refreshToken: newRefreshTokenData.refreshToken,
        };
    }

    private validateToken(token: string) {
        const decrypted = this.utilService.aesDecrypt(token);
        if (!decrypted) return { result: false, email: null, password: null };
        return {
            result: true,
            email: decrypted.email,
            password: decrypted.password,
        };
    }
}
