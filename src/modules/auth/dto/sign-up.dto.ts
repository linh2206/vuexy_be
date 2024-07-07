import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class SignUpDto {
    @ApiProperty({ example: 'admin' })
    @IsNotEmpty({ message: 'username is not empty' })
    username: string;

    @ApiProperty({ example: 'admin@gmail.com' })
    @IsNotEmpty({ message: 'email is not empty' })
    email: string;

    @ApiProperty({ example: 'admin@' })
    @IsNotEmpty({ message: 'password is not empty' })
    password: string;

    @ApiProperty()
    @IsOptional()
    firstName: string;

    @ApiProperty()
    @IsOptional()
    avatar: string;

    @ApiProperty()
    @IsOptional()
    provider: string[];
}
