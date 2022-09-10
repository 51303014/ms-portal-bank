import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Put,
    Query,
    InternalServerErrorException,
    BadRequestException,
    Patch,
    NotFoundException, ForbiddenException,
} from '@nestjs/common';
import {ENUM_PERMISSIONS} from 'src/permission/permission.constant';
import {
    GetUser,
    UserDeleteGuard,
    UserGetGuard, UserProfileGuard,
    UserUpdateActiveGuard,
    UserUpdateGuard,
    UserUpdateInactiveGuard,
} from '../user.decorator';
import {AuthAdminJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_ROLE_STATUS_CODE_ERROR} from 'src/role/role.constant';
import {UserService} from '../service/user.service';
import {RoleService} from 'src/role/service/role.service';
import {IUserCheckExist, IUserDocument} from '../user.interface';
import {ENUM_USER_STATUS_CODE_ERROR} from '../user.constant';
import {PaginationService} from 'src/pagination/service/pagination.service';
import {AuthService} from 'src/auth/service/auth.service';
import {
    Response,
    ResponsePaging,
} from 'src/utils/response/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/utils/response/response.interface';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {UserListDto} from '../dto/user.list.dto';
import {UserListSerialization} from '../serialization/user.list.serialization';
import {RequestParamGuard} from 'src/utils/request/request.decorator';
import {UserRequestDto} from '../dto/user.request.dto';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {IncomeService} from '../../income/service/income.service';
import {TYPE_LIST_INCOME} from "../../income/income.constant";
import {IncomeDocument} from "../../income/schema/income.schema";
import {CustomerDocument} from "../../customers/schema/customer.schema";
import {CustomerService} from "../../customers/service/customer.service";
import {CustomerListSerialization} from "../../customers/serialization/customer.list.serialization";
import {HelperDateService} from "../../utils/helper/service/helper.date.service";
import {WorkCustomerDocument} from "../../workCustomer/schema/workCustomer.schema";
import {WorkCustomerService} from "../../workCustomer/service/workCustomer.service";
import {WorkCustomerListSerialization} from "../../workCustomer/serialization/work-customer.list.serialization";

@Controller({
    version: '1',
    path: 'user',
})
export class UserAdminController {
    constructor(
        private readonly authService: AuthService,
        private readonly paginationService: PaginationService,
        private readonly userService: UserService,
        private readonly incomeService: IncomeService,
        private readonly customerService: CustomerService,
        private readonly helperDateService: HelperDateService,
        private readonly workCustomerService: WorkCustomerService,
    ) {
    }

    @ResponsePaging('user.list')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ErrorMeta(UserAdminController.name, 'list')
    @Get('/list')
    async list(
        @Query()
            {
                page,
                perPage,
                sort,
                search,
                availableSort,
                availableSearch,
            }: UserListDto
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};
        if (search) {
            find['$or'] = [
                {
                    firstName: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    lastName: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    email: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    mobileNumber: search,
                },
            ];
        }
        const users: IUserDocument[] = await this.userService.findAll(find, {
            limit: perPage,
            skip: skip,
            sort,
        });
        const totalData: number = await this.userService.getTotal(find);
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        const data: UserListSerialization[] =
            await this.userService.serializationList(users);

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            availableSearch,
            availableSort,
            data,
        };
    }

    @ResponsePaging('customer-birthday.list')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ErrorMeta(UserAdminController.name, 'list')
    @Get('/list-birthday')
    async getListBirthday(
        @Query()
            {
                page,
                perPage,
                search,
            }: UserListDto
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};
        const sort: Record<string, any> = {
            birthday: 1
        }
        if (search) {
            find['$or'] = [
                {
                    cif: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    }
                },
            ];
        }
        find['$expr'] = {
            "$and": [
                {"$eq": [{"$month": "$birthday"}, {"$month": new Date()}]},
            ]
        };
        const customerInfo: CustomerDocument[] = await this.customerService.findAll(find, {
            limit: perPage,
            skip: skip,
            sort
        });
        const totalData: number = await this.customerService.getTotal(find);
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        const data: CustomerListSerialization[] =
            await this.customerService.serializationList(customerInfo);

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data,
        };
    }


    @ResponsePaging('work-progress.list')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ErrorMeta(UserAdminController.name, 'list')
    @Get('/list-progress')
    async getListWorkProgress(
        @Query()
            {
                page,
                perPage,
                search,
            }: UserListDto
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};
        if (search) {
            find['$or'] = [
                {
                    cif: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    codeAM: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    codeDepartmentLevelSix: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                },
            ];
        }
        find['$expr'] = {
            "$and": [
                {"$eq": [{"$dayOfMonth": "$deadline"}, {"$dayOfMonth": this.helperDateService.addDays(new Date, 3)}]},
            ]
        };

        const customerInfo: WorkCustomerDocument[] = await this.workCustomerService.findAll(find, {
            limit: perPage,
            skip: skip
        });
        const totalData: number = await this.workCustomerService.getTotal(find);
        const totalPage: number = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        const data: WorkCustomerListSerialization[] =
            await this.workCustomerService.serializationList(customerInfo);

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data,
        };
    }

    @Response('user.get')
    @UserGetGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ErrorMeta(UserAdminController.name, 'get')
    @Get('get/:user')
    async get(@GetUser() user: IUserDocument): Promise<IResponse> {
        return this.userService.serializationGet(user);
    }

    @Response('admin.getInfoIncome')
    @UserProfileGuard()
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ErrorMeta(UserAdminController.name, 'get')
    @Get('/getAllIncome')
    async getInfoIncome(@GetUser() user: IUserDocument,
                        @Query()
                            {
                                type,
                                page,
                                perPage,
                                search,
                            }): Promise<IResponse> {
        if (!type || !TYPE_LIST_INCOME[type]) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'type.error.notFound',
            });
        }

        if (user?.role?.name !== 'admin') {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'role.error.invalid',
            });
        }
        try {
            const skip: number = await this.paginationService.skip(page, perPage);
            const incomeInfo: IncomeDocument[] = type === TYPE_LIST_INCOME.income ?
                await this.incomeService.findAllIncomeGroupByDepartment(search, {
                    skip: skip,
                    limit: +perPage,
                    currentPage: +page,
                }) : await this.incomeService.findAllScaleGroupByDepartment(search, {
                    skip: skip,
                    limit: +perPage,
                    currentPage: +page,
                });

            if (!incomeInfo.length) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                    message: 'incomeInfoDepartment.error.notFound',
                });
            }
            return incomeInfo
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }


    @Response('admin.getIncomeUser')
    @UserProfileGuard()
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ErrorMeta(UserAdminController.name, 'get')
    @Get('/getIncomeUser')
    async getInfoIncomeBaseUser(@GetUser() user: IUserDocument,
                        @Query()
                            {
                                type,
                                page,
                                perPage,
                                search,
                            }): Promise<IResponse> {
        if (!type || !TYPE_LIST_INCOME[type]) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'type.error.notFound',
            });
        }

        if (user?.role?.name !== 'admin') {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'role.error.invalid',
            });
        }
        try {
            const skip: number = await this.paginationService.skip(page, perPage);
            const incomeInfo: IncomeDocument[] = type === TYPE_LIST_INCOME.income ?
                await this.incomeService.findAllIncomeGroupByUser(search, {
                    skip: skip,
                    limit: +perPage,
                    currentPage: +page,
                }) : await this.incomeService.findAllScaleGroupByUser(search, {
                    skip: skip,
                    limit: +perPage,
                    currentPage: +page,
                });

            if (!incomeInfo.length) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                    message: 'incomeInfoDepartment.error.notFound',
                });
            }
            return incomeInfo
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }

    // @Response('user.create')
    // @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_CREATE)
    // @ErrorMeta(UserAdminController.name, 'create')
    // @Post('/create')
    // async create(
    //     @Body()
    //     body: UserCreateDto
    // ): Promise<IResponse> {
    //     const checkExist: IUserCheckExist = await this.userService.checkExist(
    //         body.codeEmployee,
    //         body.mobileNumber
    //     );
    //
    //     if (checkExist.codeEmployee && checkExist.mobileNumber) {
    //         throw new BadRequestException({
    //             statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EXISTS_ERROR,
    //             message: 'user.error.exist',
    //         });
    //     } else if (checkExist.codeEmployee) {
    //         throw new BadRequestException({
    //             statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
    //             message: 'user.error.emailExist',
    //         });
    //     } else if (checkExist.mobileNumber) {
    //         throw new BadRequestException({
    //             statusCode:
    //                 ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
    //             message: 'user.error.mobileNumberExist',
    //         });
    //     }
    //
    //     const role = await this.roleService.findOneById(body.role);
    //     if (!role) {
    //         throw new NotFoundException({
    //             statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
    //             message: 'role.error.notFound',
    //         });
    //     }
    //
    //     try {
    //         const password = await this.authService.createPassword(
    //             body.password
    //         );
    //
    //         const create = await this.userService.create({
    //             firstName: body.firstName,
    //             lastName: body.lastName,
    //             codeEmployee: body.codeEmployee,
    //             mobileNumber: body.mobileNumber,
    //             role: body.role,
    //             password: password.passwordHash,
    //             passwordExpired: password.passwordExpired,
    //             salt: password.salt,
    //         });
    //
    //         return {
    //             _id: create._id,
    //         };
    //     } catch (err: any) {
    //         throw new InternalServerErrorException({
    //             statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
    //             message: 'http.serverError.internalServerError',
    //         });
    //     }
    // }

    @Response('user.delete')
    @UserDeleteGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_DELETE)
    @ErrorMeta(UserAdminController.name, 'delete')
    @Delete('/delete/:user')
    async delete(@GetUser() user: IUserDocument): Promise<void> {
        try {
            await this.userService.deleteOneById(user._id);
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }

    // @Response('user.update')
    // @UserUpdateGuard()
    // @RequestParamGuard(UserRequestDto)
    // @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE)
    // @ErrorMeta(UserAdminController.name, 'update')
    // @Put('/update/:user')
    // async update(
    //     @GetUser() user: IUserDocument,
    //     @Body()
    //     body: UserUpdateDto
    // ): Promise<IResponse> {
    //     try {
    //         await this.userService.updateOneById(user._id, body);
    //     } catch (err: any) {
    //         throw new InternalServerErrorException({
    //             statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
    //             message: 'http.serverError.internalServerError',
    //         });
    //     }
    //
    //     return {
    //         _id: user._id,
    //     };
    // }

    @Response('user.inactive')
    @UserUpdateInactiveGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE)
    @ErrorMeta(UserAdminController.name, 'inactive')
    @Patch('/update/:user/inactive')
    async inactive(@GetUser() user: IUserDocument): Promise<void> {
        try {
            await this.userService.inactive(user._id);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }

    @Response('user.active')
    @UserUpdateActiveGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE)
    @ErrorMeta(UserAdminController.name, 'active')
    @Patch('/update/:user/active')
    async active(@GetUser() user: IUserDocument): Promise<void> {
        try {
            await this.userService.active(user._id);
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }
}
