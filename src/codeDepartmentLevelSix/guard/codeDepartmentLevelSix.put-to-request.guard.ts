import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {CodeDepartmentLevelSixService} from "../service/codeDepartmentLevelSix.service";
import {IRoleDocument} from "../../role/role.interface";

@Injectable()
export class CodeDepartmentLevelSixPutToRequestGuard implements CanActivate {
    constructor(private readonly roleService: CodeDepartmentLevelSixService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { role } = params;

        const check: IRoleDocument =
            await this.roleService.findOneById<IRoleDocument>(role, {
                populate: {
                    permission: true,
                },
            });
        request.__role = check;

        return true;
    }
}
