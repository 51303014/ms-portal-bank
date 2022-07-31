import {Type} from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
} from 'class-validator';

export class CompanyCreateDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly cif: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly nameCompany?: string;


    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly cifCompany?: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly position?: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    readonly relationshipOtherCompany?: string;

}
