import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Query
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {GetUser, UserProfileGuard} from "../../user/user.decorator";
import {WorkCustomerService} from "../service/workCustomer.service";
import {IWorkCustomerCreate} from "../workCustomer.interface";

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
}
