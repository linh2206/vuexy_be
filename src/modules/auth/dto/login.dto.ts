import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'admin@gmail.com' })
    @IsNotEmpty({ message: 'email is not empty' })
    email: string;

    @ApiProperty({ example: 'admin1' })
    @IsNotEmpty({ message: 'password is not empty' })
    password: string;
}
