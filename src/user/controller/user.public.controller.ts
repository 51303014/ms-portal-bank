import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    UploadedFile,
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {IResponse} from 'src/utils/response/response.interface';
import {UserService} from '../service/user.service';
import {GetUser, UserProfileGuard} from '../user.decorator';
import {IUserCreate, IUserDocument} from '../user.interface';
import {UploadFileSingle} from "../../utils/file/file.decorator";
import {ENUM_FILE_TYPE} from "../../utils/file/file.constant";
import Excel from "exceljs";
import {ENUM_STATUS_CODE_ERROR} from "../../utils/error/error.constant";
import {HelperFileService} from "../../utils/helper/service/helper.file.service";
import {RoleDocument} from "../../role/schema/role.schema";
import {RoleService} from "../../role/service/role.service";
import {ROLE_USER} from "../user.constant";
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
        return await this.incomeService.findAllIncome(user.codeAM);
    }

}
