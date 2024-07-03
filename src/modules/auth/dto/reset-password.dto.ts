import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ example: 'abc' })
    @IsNotEmpty({ message: 'Token is not empty' })
    token: string;

    @ApiProperty({ example: 'xyz' })
    @IsNotEmpty({ message: 'password is not empty' })
    password: string;
}
