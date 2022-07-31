import {Type} from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    ValidateIf, IsDate,
} from 'class-validator';

export class WorkCustomerCreateDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly cif: string;

    @IsString()
    @Type(() => String)
    readonly workHandle: string;

    @IsString()
    @Type(() => String)
    readonly inProgress: string;


    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly result: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly statusFix: string;

    @IsDate()
    @IsOptional()
    @ValidateIf((e) => e.type !== '')
    @Type(() => Date)
    readonly dateStart?: Date;

    @IsDate()
    @IsOptional()
    @ValidateIf((e) => e.type !== '')
    @Type(() => Date)
    readonly deadline?: Date;

}
