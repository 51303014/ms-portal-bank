import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    ValidateIf,
} from 'class-validator';

export class UserUpdateDto {
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly codeEmployee: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @Type(() => String)
    readonly firstName: string;

    @IsString()
    @IsOptional()
    @ValidateIf((e) => e.lastName !== '')
    @MaxLength(30)
    @Type(() => String)
    readonly lastName?: string;
}
