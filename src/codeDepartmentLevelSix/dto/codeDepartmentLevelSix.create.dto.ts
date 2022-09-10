import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CodeDepartmentLevelSixCreateDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(300)
    @Type(() => String)
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    @Type(() => String)
    readonly code: string;
}
