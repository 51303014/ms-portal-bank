import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    ValidateIf,
} from 'class-validator';

export class OtherInfoUpdateDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @Type(() => String)
    readonly fileName: string;

    @IsString()
    @IsOptional()
    @ValidateIf((e) => e.type !== '')
    @MaxLength(30)
    @Type(() => String)
    readonly type?: string;
}
