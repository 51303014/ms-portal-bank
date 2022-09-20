import {
    Controller,
    Get,
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {IResponse} from 'src/utils/response/response.interface';
import {UserService} from '../service/user.service';
import {GetUser, UserProfileGuard} from '../user.decorator';
import {IUserDocument} from '../user.interface';
import {RoleService} from "../../role/service/role.service";
import {IncomeService} from "../../income/service/income.service";

@Controller({
    version: '1',
    path: 'user',
})
export class UserPublicController {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly incomeService: IncomeService,
    ) {
    }

    @Response('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(UserPublicController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: IUserDocument): Promise<IResponse> {
        return this.userService.serializationProfile(user);
    }

    @Response('user.getInfoTotal')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(UserPublicController.name, 'get')
    @Get('/getInfoTotal')
    async getInfoIncome(@GetUser() user: IUserDocument): Promise<IResponse> {
        if (user?.role?.name === 'user') {
            return await this.incomeService.findAllIncome(user.codeAM);
        }
        if (user?.role?.name === 'leader') {
            return await this.incomeService.findAllIncomeByCodeLevelSix(user.codeDepartmentLevelSix);
        }
    }

}
