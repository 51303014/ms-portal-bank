import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
} from 'class-validator';

export class ParentCreateDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly cif: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly cifRelevant: string;

    @IsString()
    @Type(() => String)
    readonly fullNameRelevant: string;

    @IsString()
    @Type(() => String)
    readonly relationship: string;


}
