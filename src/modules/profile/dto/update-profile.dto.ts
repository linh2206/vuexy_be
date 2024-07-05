import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty()
    @IsOptional()
    firstName: string;

    @ApiProperty()
    @IsOptional()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsOptional()
    avatar: string;

    @ApiProperty()
    @IsOptional()
    zipCode: string;

    @ApiProperty()
    @IsOptional()
    phone: string;

    @ApiProperty()
    @IsOptional()
    address: string;

    @ApiProperty()
    @IsOptional()
    organization: string;

    @ApiProperty()
    @IsOptional()
    state: string;

    @ApiProperty()
    @IsOptional()
    country: string;

    @ApiProperty()
    @IsOptional()
    language: string[];
}
