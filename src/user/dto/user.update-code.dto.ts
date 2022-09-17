import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional, IsMongoId, IsArray,
} from 'class-validator';

export class UserUpdateCodeDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @Type(() => String)
    readonly codeEmployee: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @Type(() => String)
    readonly codeAM?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @Type(() => String)
    readonly codeDepartmentLevelSix?: string;

    @IsArray()
    @IsOptional()
    @Type(() => Array)
    readonly codeLevelSix?: string[];

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @Type(() => String)
    readonly position?: string;

    @IsOptional()
    @IsMongoId()
    @MaxLength(100)
    @Type(() => String)
    readonly role?: string;
}
