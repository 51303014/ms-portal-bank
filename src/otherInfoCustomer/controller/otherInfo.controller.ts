import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException, Post,
    Query
} from '@nestjs/common';
import {AuthAdminJwtGuard, AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {ResponseCustom} from 'src/utils/response/response.decorator';
import {GetUser, UserProfileGuard} from "../../user/user.decorator";
import {OtherInfoService} from "../service/otherInfo.service";
import {IOtherInfoCustomerCreate, IOtherInfoCustomerDocument} from "../otherInfo.interface";
import {ENUM_PERMISSIONS} from "../../permission/permission.constant";
import {IResponse} from "../../utils/response/response.interface";
import {OtherInfoCreateDto} from "../dto/otherInfo.create.dto";
import {IUserDocument} from "../../user/user.interface";
import {Types} from "mongoose";

@Controller({
    version: '1',
    path: 'otherInfo',
})
export class OtherInfoController {
    constructor(
        private readonly otherInfoCustomerService: OtherInfoService,
    ) {
    }

    @ResponseCustom('otherInfo.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(OtherInfoController.name, 'otherInfo-get-detail')
    @Get('/')
    async getInfo(
        @GetUser() user: IOtherInfoCustomerDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const otherInfo: IOtherInfoCustomerCreate[] = await this.otherInfoCustomerService.findAll({cif});
        if (otherInfo) {
            try {
                return otherInfo
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }

    @ResponseCustom('otherInfo.create')
    @UserProfileGuard()
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_CREATE)
    @ErrorMeta(OtherInfoController.name, 'create')
    @Post('/create')
    async create(
        @GetUser() user: IUserDocument,
        @Body()
            bodyOtherInfos: OtherInfoCreateDto[]
    ): Promise<IResponse> {
        // const exist: boolean = await this.parentService.exists(name);
        // if (exist) {
        //     throw new BadRequestException({
        //         statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
        //         message: 'role.error.exist',
        //     });
        // }

        // for (const permission of permissions) {
        //     const checkPermission: PermissionDocument =
        //         await this.permissionService.findOneById(permission);
        //
        //     if (!checkPermission) {
        //         throw new NotFoundException({
        //             statusCode:
        //             ENUM_PERMISSION_STATUS_CODE_ERROR.PERMISSION_NOT_FOUND_ERROR,
        //             message: 'permission.error.notFound',
        //         });
        //     }
        // }

        try {
            bodyOtherInfos.map(async (info) => {
                const infoOther: IOtherInfoCustomerCreate = {
                    _id: new Types.ObjectId(info._id),
                    cif: info.cif,
                    dateKHCCAdditional: info.dateKHCCAdditional ? new Date(info.dateKHCCAdditional) : null,
                    productsApply: info.productsApply,
                    programsApplied: info.programsApplied,
                    priorityKHRegistered: info.priorityKHRegistered,
                    expensesPayed: info.expensesPayed,
                    habitsCustomer: info.habitsCustomer,
                    favouriteCustomer: info.favouriteCustomer,
                    user: user._id,
                }
                await this.otherInfoCustomerService.create(infoOther)
            })
            return;
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }
}
