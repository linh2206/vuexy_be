import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty({ example: 'admin@gmail.com' })
    @IsNotEmpty({ message: 'Email is not empty' })
    email: string;
}
