import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    MaxLength,
} from 'class-validator';

export class UserResetPassDto {
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly codeEmployee: string;

    @IsNotEmpty()
    readonly password: string;
}
