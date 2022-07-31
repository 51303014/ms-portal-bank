import {Type} from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    ValidateIf, IsDate,
} from 'class-validator';

export class OtherInfoCreateDto {

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
