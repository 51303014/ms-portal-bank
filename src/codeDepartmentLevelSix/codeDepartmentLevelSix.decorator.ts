import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import {CodeDepartmentLevelSixPutToRequestGuard} from "./guard/codeDepartmentLevelSix.put-to-request.guard";
import {ROLE_ACTIVE_META_KEY} from "../role/role.constant";
import {CodeDepartmentLevelSixNotFoundGuard} from "./guard/codeDepartmentLevelSix.not-found.guard";
import {CodeDepartmentLevelSixActiveGuard} from "./guard/codeDepartmentLevelSix.active.guard";
import {CodeDepartmentLevelSixUsedGuard} from "./guard/codeDepartmentLevelSix.used.guard";

export const GetIdCodeLevelSix = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const { params } = ctx.switchToHttp().getRequest();
        return params?.id;
    }
);
export function RoleGetGuard(): any {
    return applyDecorators(UseGuards(CodeDepartmentLevelSixPutToRequestGuard, CodeDepartmentLevelSixNotFoundGuard));
}

export function RoleUpdateGuard(): any {
    return applyDecorators(
        UseGuards(CodeDepartmentLevelSixPutToRequestGuard, CodeDepartmentLevelSixNotFoundGuard, CodeDepartmentLevelSixActiveGuard),
        SetMetadata(ROLE_ACTIVE_META_KEY, [true])
    );
}

export function RoleDeleteGuard(): any {
    return applyDecorators(
        UseGuards(
            CodeDepartmentLevelSixPutToRequestGuard,
            CodeDepartmentLevelSixNotFoundGuard,
            CodeDepartmentLevelSixActiveGuard,
            CodeDepartmentLevelSixUsedGuard
        ),
        SetMetadata(ROLE_ACTIVE_META_KEY, [true])
    );
}

export function RoleUpdateActiveGuard(): any {
    return applyDecorators(
        UseGuards(CodeDepartmentLevelSixPutToRequestGuard, CodeDepartmentLevelSixNotFoundGuard, CodeDepartmentLevelSixActiveGuard),
        SetMetadata(ROLE_ACTIVE_META_KEY, [false])
    );
}

export function RoleUpdateInactiveGuard(): any {
    return applyDecorators(
        UseGuards(CodeDepartmentLevelSixPutToRequestGuard, CodeDepartmentLevelSixNotFoundGuard, CodeDepartmentLevelSixActiveGuard),
        SetMetadata(ROLE_ACTIVE_META_KEY, [true])
    );
}
