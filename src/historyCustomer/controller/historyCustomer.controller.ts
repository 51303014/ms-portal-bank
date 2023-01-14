import {
    Controller,
    ForbiddenException,
    Get,
    InternalServerErrorException, NotFoundException,
    Query,
} from '@nestjs/common';
import { AuthPublicJwtGuard } from 'src/auth/auth.decorator';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { ResponsePaging } from 'src/utils/response/response.decorator';
import { IResponsePaging } from 'src/utils/response/response.interface';
import { PaginationService } from '../../pagination/service/pagination.service';
import { IUserDocument } from '../../user/user.interface';
import { HistoryCustomerService } from '../service/historyCustomer.service';
import { GetUser, UserProfileGuard } from '../historyCustomer.decorator';
import { HistoryCustomerDocument } from '../schema/historyCustomer.schema';
import { ENUM_USER_STATUS_CODE_ERROR } from '../historyCustomer.constant';
import { HistoryCustomerListSerialization } from '../serialization/historyCustomer.list.serialization';

@Controller({
    version: '1',
    path: 'history',
})
export class HistoryCustomerController {
    constructor(
        private readonly historyCustomerService: HistoryCustomerService,
        private readonly paginationService: PaginationService,
    ) {
    }

    @ResponsePaging('history.list')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(HistoryCustomerController.name, 'list-history')
    @Get('/list')
    async getListCustomer(
        @GetUser() user: IUserDocument,
        @Query()
            {
                date,
                filter,
                page,
                perPage,
            },
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};
        switch (filter) {
            case 'day':
                find['$expr'] = {
                    '$and': [
                        { '$eq': [{ '$dayOfMonth': '$effectiveDate' }, { '$dayOfMonth': new Date(date) }] },
                    ],
                };
                break;
            case 'month':
                find['$expr'] = {
                    '$and': [
                        { '$eq': [{ '$month': '$effectiveDate' }, { '$month': new Date(date) }] },
                    ],
                };
                break;
            case 'year':
                find['$expr'] = {
                    '$and': [
                        { '$eq': [{ '$year': '$effectiveDate' }, { '$year': new Date(date) }] },
                    ],
                };
                break;
            default:
        }
        let customerInfo: HistoryCustomerDocument[] = await this.historyCustomerService.findAll(find, {
            limit: perPage,
            skip: skip,
        });
        if (user?.role?.name !== 'admin') {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'role.error.invalid',
            });
        }
        if (!customerInfo.length) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'customerInfo.error.notFound',
            });
        }
        try {
            const totalData: number = filter === 'all' ?  await this.historyCustomerService.getTotal(find) : customerInfo.length;
            const totalPage: number = await this.paginationService.totalPage(
                totalData,
                +perPage,
            );

            const data: HistoryCustomerListSerialization[] =
                await this.historyCustomerService.serializationList(customerInfo);

            return {
                totalData,
                totalPage,
                currentPage: page,
                perPage,
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }

}
