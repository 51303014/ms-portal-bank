import { Type } from 'class-transformer';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class OtherInfoRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    @Type(() => String)
    user: string;
}
