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
import {Response} from 'src/utils/response/response.decorator';
import {GetUser, UserProfileGuard} from "../../user/user.decorator";
import {WorkCustomerService} from "../service/workCustomer.service";
import {IWorkCustomerCreate} from "../workCustomer.interface";
import {ENUM_PERMISSIONS} from "../../permission/permission.constant";
import {CompanyCreateDto} from "../../company/dto/company.create.dto";
import {IResponse} from "../../utils/response/response.interface";
import {ICompanyCreate} from "../../company/company.interface";
import {WorkCustomerCreateDto} from "../dto/workCustomer.create.dto";

class IParentDocument {
}

@Controller({
    version: '1',
    path: 'workCustomers',
})
export class WorkCustomerController {
    constructor(
        private readonly workCustomerService: WorkCustomerService,
    ) {
    }

    @Response('workCustomers.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(WorkCustomerController.name, 'workCustomers-get-detail')
    @Get('/')
    async getInfo(
        @GetUser() user: IParentDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const info: IWorkCustomerCreate[] = await this.workCustomerService.findAll({cif});
        if (info) {
            try {
                return info
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }

    @Response('workCustomers.create')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_CREATE)
    @ErrorMeta(WorkCustomerController.name, 'create')
    @Post('/create')
    async create(
        @Body()
            bodyWorkCustomers: WorkCustomerCreateDto[]
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
            bodyWorkCustomers.map(async (info) => {
                const infoWorkCus: IWorkCustomerCreate = {
                    cif: info.cif,
                    workHandle: info.workHandle,
                    dateStart: new Date(info.dateStart),
                    deadline: new Date(info.deadline),
                    inProgress: info.inProgress,
                    result: info.result,
                    statusFix: info.statusFix
                }
                await this.workCustomerService.create(infoWorkCus)
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
