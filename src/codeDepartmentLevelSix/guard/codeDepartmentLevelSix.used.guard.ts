import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserService } from 'src/user/service/user.service';
import { UserDocument } from 'src/user/schema/user.schema';
import {ENUM_ROLE_STATUS_CODE_ERROR} from "../codeDepartmentLevelSix.constant";

@Injectable()
export class CodeDepartmentLevelSixUsedGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __role } = context.switchToHttp().getRequest();
        const check: UserDocument = await this.userService.findOne({
            role: new Types.ObjectId(__role._id),
        });

        if (check) {
            throw new BadRequestException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_USED_ERROR,
                message: 'role.error.used',
            });
        }
        return true;
    }
}
