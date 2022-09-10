import { Type } from 'class-transformer';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CodeDepartmentLevelSixRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    @Type(() => String)
    role: string;
}
