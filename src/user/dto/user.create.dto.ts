import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsMongoId, IsOptional, IsArray,
} from 'class-validator';

export class UserCreateDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @Type(() => String)
    readonly codeEmployee: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    @Type(() => String)
    readonly fullName: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly codeAM?: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly codeDepartmentLevelSix?: string;

    @IsArray()
    @IsOptional()
    @Type(() => Array)
    readonly codeLevelSix?: string[];

    @IsNotEmpty()
    @IsMongoId()
    readonly role: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(50)
    @Type(() => String)
    readonly position: string;

    @IsNotEmpty()
    readonly password: string;
}
