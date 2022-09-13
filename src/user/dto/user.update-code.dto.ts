import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional, IsMongoId,
} from 'class-validator';

export class UserUpdateCodeDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @Type(() => String)
    readonly codeEmployee: string;

    @IsString()
    @IsOptional()
    @MaxLength(30)
    @Type(() => String)
    readonly codeAM?: string;

    @IsString()
    @IsOptional()
    @MaxLength(30)
    @Type(() => String)
    readonly codeDepartmentLevelSix?: string;

    @IsString()
    @IsOptional()
    @MaxLength(30)
    @Type(() => Array)
    readonly codeLevelSix?: string[];

    @IsString()
    @IsOptional()
    @MaxLength(30)
    @Type(() => String)
    readonly position?: string;

    @IsOptional()
    @IsMongoId()
    @MaxLength(30)
    @Type(() => String)
    readonly role?: string;
}
