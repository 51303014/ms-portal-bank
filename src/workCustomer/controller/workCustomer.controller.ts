import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException, NotFoundException, Post,
    Query
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {ResponseCustom} from 'src/utils/response/response.decorator';
import {GetUser, UserProfileGuard} from "../../user/user.decorator";
import {WorkCustomerService} from "../service/workCustomer.service";
import {IWorkCustomerCreate} from "../workCustomer.interface";
import {IResponse} from "../../utils/response/response.interface";
import {WorkCustomerCreateDto} from "../dto/workCustomer.create.dto";
import {IUserDocument} from "../../user/user.interface";
import {ENUM_USER_STATUS_CODE_ERROR} from "../../customers/customer.constant";
import {WorkCustomerDocument} from "../schema/workCustomer.schema";
import {HelperDateService} from "../../utils/helper/service/helper.date.service";
import { Types } from 'mongoose';

class IParentDocument {
}

@Controller({
    version: '1',
    path: 'workCustomers',
})
export class WorkCustomerController {
    constructor(
        private readonly workCustomerService: WorkCustomerService,
        private readonly helperDateService: HelperDateService,
    ) {
    }

    @ResponseCustom('workCustomers.get.cif')
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
        const cifParams = cif ? cif : '';
        const info: IWorkCustomerCreate[] = await this.workCustomerService.findAll({cifParams});
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

    @ResponseCustom('workCustomers.list')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(WorkCustomerController.name, 'workCustomers-get-list')
    @Get('/progress')
    async getWorkCustomers(
        @GetUser() user: IUserDocument,
    ): Promise<any> {
        const find: Record<string, any> = {};
        find['$expr'] = {
            "$and": [
                {user: user._id},
                {"$eq": [{"$dayOfMonth": "$deadline"}, {"$dayOfMonth": this.helperDateService.addDays(new Date, 3)}]},
            ]
        };
        const customerInfo: WorkCustomerDocument[] = await this.workCustomerService.findAll(find);

        if (!customerInfo.length) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'workProgress.error.notFound',
            });
        }

        return customerInfo;
    }

    @ResponseCustom('workCustomers.create')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(WorkCustomerController.name, 'create')
    @Post('/create')
    async create(
        @GetUser() user: IUserDocument,
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
                    _id:  new Types.ObjectId(info._id) ,
                    cif: info.cif,
                    user: user._id,
                    codeAM: user.codeAM,
                    workHandle: info.workHandle,
                    dateStart: new Date(info.dateStart),
                    deadline: new Date(info.deadline),
                    inProgress: info.inProgress,
                    result: info.result,
                    statusFix: info.statusFix
                }
                await this.workCustomerService.createOrUpdate(infoWorkCus)
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
