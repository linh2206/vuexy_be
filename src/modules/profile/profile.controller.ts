import { BadRequestException, Body, Controller, Get, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BYPASS_PERMISSION } from '~/common/constants/constant';
import { Permission } from '~/common/decorators/permission.decorator';
import { multerOptions } from '~/config/fileUpload.config';
import { UtilService } from '~/shared/services';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Profile')
@ApiBasicAuth('authorization')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService, private readonly utilService: UtilService) {}

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Permission(BYPASS_PERMISSION)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', multerOptions()))
    async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        const media = await this.utilService.handleUploadedFile(file, req.headers['_userId'], 'avatar');
        if (!media) throw new BadRequestException('File invalid');

        return {
            result: true,
            message: 'Upload success',
            data: media,
        };
    }

    @Permission(BYPASS_PERMISSION)
    @Get()
    findOne(@Req() req: Request) {
        return this.profileService.findOne(req.headers['_id'].toString());
    }

    @Permission(BYPASS_PERMISSION)
    @Patch()
    update(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profileService.update(req.headers['_id'].toString(), updateProfileDto);
    }

    @Permission(BYPASS_PERMISSION)
    @Patch('change-password')
    changePassword(@Req() req: Request, @Body() updateProfileDto: ChangePasswordDto) {
        return this.profileService.changePassword(req.headers['_id'].toString(), updateProfileDto);
    }

    @Permission(BYPASS_PERMISSION)
    @Patch('reset-password')
    resetPassword(@Req() req: Request, @Body() resetPassword: ResetPasswordDto) {
        return this.profileService.resetPassword(req.headers['_id'].toString(), resetPassword);
    }
}
