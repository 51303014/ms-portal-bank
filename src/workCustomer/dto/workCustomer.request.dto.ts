import { Type } from 'class-transformer';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class WorkCustomerRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    @Type(() => String)
    user: string;
}
