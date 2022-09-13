import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsMongoId, IsOptional,
} from 'class-validator';

export class UserCreateDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @Type(() => String)
    readonly codeEmployee: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(100)
    @Type(() => String)
    readonly fullName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(30)
    @Type(() => String)
    readonly codeAM: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(50)
    @Type(() => String)
    readonly codeDepartmentLevelSix: string;

    @IsString()
    @IsMongoId()
    @IsOptional()
    @Type(() => Array)
    readonly codeLevelSix?: string[];

    @IsNotEmpty()
    @IsMongoId()
    readonly role: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    @Type(() => String)
    readonly position: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    @Type(() => String)
    readonly department: string;

    @IsNotEmpty()
    readonly password: string;
}
