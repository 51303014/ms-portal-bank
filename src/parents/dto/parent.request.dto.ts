import { Type } from 'class-transformer';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class ParentRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    @Type(() => String)
    user: string;
}
