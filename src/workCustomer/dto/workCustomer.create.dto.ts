import {Type} from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    ValidateIf, IsDate, IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class WorkCustomerCreateDto {

    @Type(() => IsMongoId())
    readonly _id: Types.ObjectId;

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
