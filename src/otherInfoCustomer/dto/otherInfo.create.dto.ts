import {Type} from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    ValidateIf, IsDate, IsMongoId,
} from 'class-validator';
import {Types} from "mongoose";

export class OtherInfoCreateDto {
    @Type(() => IsMongoId())
    readonly _id: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly cif: string;

    @IsString()
    @Type(() => String)
    readonly productsApply: string;

    @IsString()
    @Type(() => String)
    readonly programsApplied: string;

    @IsString()
    @Type(() => String)
    readonly priorityKHRegistered: string;

    @IsString()
    @Type(() => String)
    readonly expensesPayed: string;


    @IsString()
    @Type(() => String)
    readonly habitsCustomer: string;


    @IsString()
    @Type(() => String)
    readonly favouriteCustomer: string;

    @IsDate()
    @IsOptional()
    @ValidateIf((e) => e.type !== '')
    @Type(() => Date)
    readonly dateKHCCAdditional?: Date;

}
