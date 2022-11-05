import { Type } from 'class-transformer';

export class CodeDepartmentLevelSixRequestDto {
    @Type(() => String)
    code?: string;

    @Type(() => String)
    _id?: string;
}
