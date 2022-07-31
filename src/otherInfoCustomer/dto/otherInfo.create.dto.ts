import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsMongoId,
    IsOptional,
    ValidateIf,
} from 'class-validator';
import {IAwsS3Response} from "../../aws/aws.interface";

export class OtherInfoCreateDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly fileName: string;

    @IsString()
    @IsOptional()
    @ValidateIf((e) => e.type !== '')
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    readonly type?: string;


    @IsNotEmpty()
    @IsMongoId()
    readonly user: string;

    @IsNotEmpty()
    readonly file: IAwsS3Response;
}
