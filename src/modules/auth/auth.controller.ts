import { Body, Controller, Get, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ForgotPasswordDto } from '~/modules/auth/dto/forgot-password.dto';
import { RenewTokenDto } from '~/modules/auth/dto/renew-token.dto';
import { ResetPasswordDto } from '~/modules/auth/dto/reset-password.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('sign-up')
    public async signUp(@Body() data: SignUpDto) {
        return this.authService.create(data);
    }
    @Post('login')
    public async login(@Body() data: LoginDto, @Req() req: Request, @Ip() ip) {
        return this.authService.login(data, req.headers['user-agent'].toString(), ip);
    }

    @ApiBasicAuth('authorization')
    @Post('logout')
    public async logout(@Req() req: Request) {
        const data = { session: req.headers['authorization'] };
        return this.authService.logout(data);
    }

    @Post('forgot-password')
    public async forgotPassword(@Body() data: ForgotPasswordDto) {
        return this.authService.forgotPassword(data);
    }

    @Post('reset-password')
    public async resetPassword(@Body() data: ResetPasswordDto) {
        return this.authService.resetPassword(data);
    }

    @Post('renew-token')
    public async renewToken(@Body() data: RenewTokenDto) {
        return this.authService.renewAuthToken(data);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        try {
            const token = await this.authService.googleLogin(req);
            return res.redirect(`${process.env.FONTEND_URL}?token=${token}`);
        } catch (err) {
            res.status(500).send({ success: false, message: err.message });
        }
    }
}
