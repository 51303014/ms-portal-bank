import {
    Controller, ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException, NotFoundException,
    Query
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {IResponse, IResponsePaging} from 'src/utils/response/response.interface';
import {IncomeService} from "../service/income.service";
import {GetUser, UserProfileGuard} from "../income.decorator";
import {IIncomeCreate, IIncomeDocument} from "../income.interface";
import {ENUM_USER_STATUS_CODE_ERROR} from "../../customers/customer.constant";
import {PaginationService} from "../../pagination/service/pagination.service";
import {IncomeDocument} from "../schema/income.schema";
import {IncomeListSerialization} from "../serialization/income.list.serialization";
import {IUserDocument} from "../../user/user.interface";
import {RoleLeaderAndUser, TYPE_LIST_INCOME} from "../income.constant";

@Controller({
    version: '1',
    path: 'income',
})
export class IncomeController {
    constructor(
        private readonly incomeService: IncomeService,
        private readonly paginationService: PaginationService
    ) {
    }

    @Response('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(IncomeController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: IUserDocument): Promise<IResponse> {
        return this.incomeService.serializationProfile(user);
    }

    @Response('income.list')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(IncomeController.name, 'income-get-list')
    @Get('/list')
    async getIncome(
        @GetUser() user: IUserDocument,
        @Query()
            {
                type,
                page,
                perPage,
                search,
            }
    ): Promise<IResponsePaging> {
        let totalBaseAM;
        if (!type || !TYPE_LIST_INCOME[type]) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'type.error.notFound',
            });
        }
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};
        if (search) {
            find['$or'] = [
                {
                    codeAM: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                },
            ];
        }
        if (user?.role?.name === 'user') {
            find['$and'] = [
                {
                    codeAM: user.codeAM
                },
            ];
            totalBaseAM = type === TYPE_LIST_INCOME.income ?
                await this.incomeService.findAllIncomeBaseUser(user.codeAM) :
                await this.incomeService.findAllScaleBaseUser(user.codeAM)
            ;
        }

        if (user?.role?.name === 'leader') {
            find['$and'] = [
                {
                    codeDepartmentLevelSix: user.codeDepartmentLevelSix
                },
            ];
            totalBaseAM = type === TYPE_LIST_INCOME.income ?
                await this.incomeService.findAllIncomeByCodeDepartmentLeader(user.codeDepartmentLevelSix) :
                await this.incomeService.findAllScaleByCodeDepartmentLeader(user.codeDepartmentLevelSix)
            ;
        }

        const incomeInfoModel: IncomeDocument[] = await this.incomeService.findAll(find,
            {
                skip: skip,
                limit: perPage,
            });

        if (!incomeInfoModel.length) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'incomeInfo.error.notFound',
            });
        }
        try {
            const totalData: number = await this.incomeService.getTotal(find);
            const totalPage: number = await this.paginationService.totalPage(
                totalData,
                perPage
            );
            const data: IncomeListSerialization[] =
                await this.incomeService.serializationList(incomeInfoModel);

            return {
                total: totalBaseAM,
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

    @Response('income-by-code-department.list')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(IncomeController.name, 'income-get-code-department-list')
    @Get('/list-department')
    async getIncomeByCodeDepartment(
        @GetUser() user: IUserDocument,
        @Query()
            {
                type,
                page,
                perPage,
                search,
            }
    ): Promise<IResponsePaging> {
        if (!type || !TYPE_LIST_INCOME[type]) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'type.error.notFound',
            });
        }

        if (user?.role?.name !== 'leader') {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'role.error.invalid',
            });
        }
        try {
            const skip: number = await this.paginationService.skip(page, perPage);
            const find: Record<string, any> = {};
            if (search) {
                find['$or'] = [
                    {
                        cif: {
                            $regex: new RegExp(search),
                            $options: 'i',
                        },
                    },
                ];
            }

            if (user?.role?.name === 'leader') {
                find['$and'] = [
                    {
                        codeDepartmentLevelSix: user.codeDepartmentLevelSix
                    },
                ];
            }
            const totalBaseDepartment = type === TYPE_LIST_INCOME.income ?
                await this.incomeService.findAllIncomeBaseDepartment(user.codeDepartmentLevelSix) :
                await this.incomeService.findAllScaleBaseDepartment(user.codeDepartmentLevelSix)
            ;
            const incomeInfoModel: IncomeDocument[] = await this.incomeService.findAll(find,
                {
                    skip: skip,
                    limit: perPage,
                });
            if (!incomeInfoModel.length) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                    message: 'incomeInfoDepartment.error.notFound',
                });
            }
            const totalData: number = await this.incomeService.getTotal(find);
            const totalPage: number = await this.paginationService.totalPage(
                totalData,
                perPage
            );
            const data: IncomeListSerialization[] =
                await this.incomeService.serializationList(incomeInfoModel);

            return {
                total: totalBaseDepartment,
                totalData,
                totalPage,
                currentPage: page,
                perPage,
                data,
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }


    @Response('income.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(IncomeController.name, 'income-get-detail')
    @Get('/details')
    async getCustomerInfo(
        @GetUser() user: IIncomeDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const incomeInfo: IIncomeCreate[] = await this.incomeService.findAll({cif});
        if (incomeInfo) {
            try {
                return incomeInfo
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }
}
