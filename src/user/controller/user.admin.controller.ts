import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Post, Put,
    Query,
    UploadedFile,
} from '@nestjs/common';
import {ENUM_PERMISSIONS} from 'src/permission/permission.constant';
import {
    GetUser,
    UserDeleteGuard,
    UserGetGuard,
    UserProfileGuard,
    UserUpdateActiveGuard, UserUpdateGuard,
    UserUpdateInactiveGuard,
} from '../user.decorator';
import {AuthAdminJwtGuard, AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {UserService} from '../service/user.service';
import {RoleService} from 'src/role/service/role.service';
import {IUserCheckExist, IUserCreate, IUserDocument} from '../user.interface';
import {ADMIN_USER, ENUM_USER_STATUS_CODE_ERROR, ROLE_USER} from '../user.constant';
import {PaginationService} from 'src/pagination/service/pagination.service';
import {AuthService} from 'src/auth/service/auth.service';
import {Response, ResponsePaging,} from 'src/utils/response/response.decorator';
import {IResponse, IResponsePaging,} from 'src/utils/response/response.interface';
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
import {UploadFileSingle} from "../../utils/file/file.decorator";
import {ENUM_FILE_TYPE} from "../../utils/file/file.constant";
import Excel from "exceljs";
import {RoleDocument} from "../../role/schema/role.schema";
import {HelperFileService} from "../../utils/helper/service/helper.file.service";
import {CodeDepartmentLevelSixService} from "../../codeDepartmentLevelSix/service/codeDepartmentLevelSix.service";
import {CodeDepartmentLevelSixDocument} from "../../codeDepartmentLevelSix/schema/codeDepartmentLevelSix.schema";
import {IncomeListSerialization} from "../../income/serialization/income.list.serialization";
import {UserResetPassDto} from "../dto/user.reset-pass.dto";
import {UserUpdateCodeDto} from "../dto/user.update-code.dto";
import {UserCreateDto} from "../dto/user.create.dto";
import {ENUM_ROLE_STATUS_CODE_ERROR} from "../../role/role.constant";

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
        private readonly codeLevelSix: CodeDepartmentLevelSixService,
        private readonly helperDateService: HelperDateService,
        private readonly workCustomerService: WorkCustomerService,
        private readonly roleService: RoleService,
        private readonly fileHelperService: HelperFileService,
    ) {
    }

    @Response('income-department-detail.list')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(UserAdminController.name, 'income-get-list')
    @Get('/list-department-detail')
    async getIncomeByDepartmentDetail(
        @GetUser() user: IUserDocument,
        @Query()
            {
                page,
                perPage,
                search,
                codeDepartment,
                kindOfMoney
            }
    ): Promise<IResponsePaging> {
        if (!codeDepartment) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'codeDepartment.error.notFound',
            });
        }

        if (!kindOfMoney) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'kindOfMoney.error.notFound',
            });
        }
        if (!ADMIN_USER.includes(user?.role?.name)) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'role.error.invalid',
            });
        }

        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};
        if (search) {
            find['$or'] = [
                {
                    codeDepartmentLevelSix: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                },
            ];
        }

        find['$and'] = [
            {
                codeDepartmentLevelSix: codeDepartment
            },
            {
                kindOfMoney
            },
        ];
        const incomeInfoModel: IncomeDocument[] = await this.incomeService.findAll(find,
            {
                skip: skip,
                limit: perPage,
            });

        if (!incomeInfoModel.length) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'income-department-detail.error.notFound',
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

    @Response('income-codeAM-detail.list')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(UserAdminController.name, 'income-get-list')
    @Get('/list-codeAM-detail')
    async getIncomeByCodeAMDetail(
        @GetUser() user: IUserDocument,
        @Query()
            {
                page,
                perPage,
                search,
                codeAM,
                kindOfMoney
            }
    ): Promise<IResponsePaging> {
        if (!codeAM) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'codeAM.error.notFound',
            });
        }

        if (!kindOfMoney) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'kindOfMoney.error.notFound',
            });
        }
        if (!ADMIN_USER.includes(user?.role?.name)) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'role.error.invalid',
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

        find['$and'] = [
            {
                codeAM
            },
            {
                kindOfMoney
            },
        ];
        const incomeInfoModel: IncomeDocument[] = await this.incomeService.findAll(find,
            {
                skip: skip,
                limit: perPage,
            });

        if (!incomeInfoModel.length) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'income-codeAM-detail.error.notFound',
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

    @ResponsePaging('user.list')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ErrorMeta(UserAdminController.name, 'list')
    @Get('/list')
    async list(
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
                    codeEmployee: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    fullName: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    },
                    codeDepartmentLevelSix: {
                        $regex: new RegExp(search),
                        $options: 'i',
                    }
                },
            ];
        }
        const users: IUserDocument[] = await this.userService.findAll(find, {
            limit: perPage,
            skip: skip,
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

    async handleRole(bodyUser) {
        if (bodyUser.position === 'Giám đốc') {
            return await this.roleService.findOne<RoleDocument>(
                {
                    name: 'admin',
                }
            );
        }

        if (bodyUser.position === 'Phó Giám đốc' && bodyUser.department === 'Ban Giám đốc') {
            return await this.roleService.findOne<RoleDocument>(
                {
                    name: 'manager',
                }
            );
        }
        if (ROLE_USER.includes(bodyUser.position)) {
            return await this.roleService.findOne<RoleDocument>(
                {
                    name: 'user',
                }
            );
        }
        return await this.roleService.findOne<RoleDocument>(
            {
                name: 'leader',
            }
        );
    }

    @Response('user.upload')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_CREATE)
    @UploadFileSingle('file', ENUM_FILE_TYPE.EXCEL || ENUM_FILE_TYPE.CSV)
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(UserAdminController.name, 'upload')
    @Post('/upload')
    async upload(
        @Body() userFile: any,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<void> {
        const workbook = new Excel.Workbook();
        const content = await workbook.xlsx.load(file.buffer);
        const worksheet = content.getWorksheet(1);
        const rowStartIndex = 2;
        const numberOfRows = worksheet.rowCount - 1;
        const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
        rows.map(async row => {
            try {
                switch (userFile.fileType) {
                    case 'InfoUser':
                        const userInfo: IUserCreate = await this.userService.findOne({
                            codeEmployee: this.fileHelperService.getCellValue(row, 1),
                            fullName: this.fileHelperService.getCellValue(row, 2),
                            position: this.fileHelperService.getCellValue(row, 3),
                            birthday: this.fileHelperService.getCellValue(row, 4),
                            mobileNumber: this.fileHelperService.getCellValue(row, 5),
                            identityCard: this.fileHelperService.getCellValue(row, 6),
                            email: this.fileHelperService.getCellValue(row, 7),
                            CRA: this.fileHelperService.getCellValue(row, 8)
                        });
                        const info: IUserCreate = await this.userService.findOne({
                            codeEmployee: this.fileHelperService.getCellValue(row, 2)
                        });
                        if (info) {
                            await this.userService.updateOneById(info.codeEmployee, userInfo)
                            return;
                        }
                        return await this.userService.create(userInfo);
                    case 'InfoListAM':
                        if (!this.fileHelperService.getCellValue(row, 2)) {
                            return;
                        }
                        let bodyUser: IUserCreate = {
                            codeEmployee: this.fileHelperService.getCellValue(row, 2),
                            fullName: this.fileHelperService.getCellValue(row, 3),
                            position: this.fileHelperService.getCellValue(row, 4),
                            codeBDS: this.fileHelperService.getCellValue(row, 5),
                            codeAM: this.fileHelperService.getCellValue(row, 6),
                            codeDepartment: this.fileHelperService.getCellValue(row, 8),
                            department: this.fileHelperService.getCellValue(row, 9),
                            codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 11)
                        };
                        const role = await this.handleRole(bodyUser);
                        let codeLevelSix: CodeDepartmentLevelSixDocument[] = await this.codeLevelSix.findAll({
                            code: this.fileHelperService.getCellValue(row, 11)
                        });
                        if (role) {
                            bodyUser = {
                                ...bodyUser,
                                role: role._id
                            }
                        }

                        if (codeLevelSix) {
                            bodyUser = {
                                ...bodyUser,
                                codeLevelSix: codeLevelSix.map(v => v.code)
                            }
                        }
                        const infoUser: IUserCreate = await this.userService.findOne({
                            codeEmployee: this.fileHelperService.getCellValue(row, 2)
                        });
                        if (infoUser) {
                            return await this.userService.checkExistCodeEmployee(infoUser.codeEmployee) ?
                                await this.userService.updateUserByCodeAM(infoUser.codeEmployee, bodyUser)
                                : await this.userService.updateOneById(infoUser.codeEmployee, bodyUser);
                        }
                        return await this.userService.create(bodyUser);
                }
            } catch (error) {
                console.log(error);
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        });
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

        if (!ADMIN_USER.includes(user?.role?.name)) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'role.error.invalid',
            });
        }
        try {
            const skip: number = await this.paginationService.skip(page, perPage);
            let incomeInfo: IncomeDocument[] = type === TYPE_LIST_INCOME.income ?
                await this.incomeService.findAllIncomeGroupByDepartment(search, {
                    skip: skip,
                    limit: +perPage,
                    currentPage: +page,
                }) : await this.incomeService.findAllScaleGroupByDepartment(search, {
                    skip: skip,
                    limit: +perPage,
                    currentPage: +page,
                });

            if (user?.role?.name === 'manager') {
                incomeInfo = incomeInfo.filter(v => user.codeLevelSix.includes(v._id.codeDepartmentLevelSix));
            }

            if (!incomeInfo.length) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                    message: 'incomeInfoDepartment.error.notFound',
                });
            }
            return incomeInfo;
        } catch (error) {
            console.log(error);
            if (error?.status === 404) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                    message: 'incomeInfoDepartment.error.notFound',
                });
            }
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

        if (!ADMIN_USER.includes(user?.role?.name)) {
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
                    message: 'getIncomeUser.error.notFound',
                });
            }
            return incomeInfo;
        } catch (error) {
            console.log(error);
            if (error?.status === 404) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                    message: 'getIncomeUser.error.notFound',
                });
            }
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }

    @Response('user.reset-password')
    @UserProfileGuard()
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.SETTING_READ, ENUM_PERMISSIONS.SETTING_UPDATE)
    @ErrorMeta(UserAdminController.name, 'reset')
    @Post('/reset-password')
    async resetPassword(
        @GetUser() user: IUserDocument,
        @Body()
            body: UserResetPassDto
    ): Promise<IResponse> {
        const checkExist: IUserCheckExist = await this.userService.checkExist(
            body.codeEmployee,
        );

        if (!checkExist.codeEmployee) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EXISTS_ERROR,
                message: 'user.error.not-exist',
            });
        }

        try {
            const password = await this.authService.createPassword(
                body.password
            );
            const create = await this.userService.updatePassword(user._id, password);
            return {
                _id: create._id,
            };
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }

    @Response('user.delete')
    @UserDeleteGuard()
    @RequestParamGuard(UserRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.SETTING_READ, ENUM_PERMISSIONS.SETTING_UPDATE, ENUM_PERMISSIONS.USER_DELETE)
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

    @Response('user.create')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.SETTING_READ, ENUM_PERMISSIONS.SETTING_UPDATE, ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_CREATE)
    @ErrorMeta(UserAdminController.name, 'create')
    @Post('/create')
    async createUser(
        @Body()
            body: UserCreateDto
    ): Promise<IResponse> {
        const checkExist: IUserCheckExist = await this.userService.checkExist(
            body.codeEmployee,
        );

        if (checkExist.codeEmployee) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EXISTS_ERROR,
                message: 'user.error.exist',
            });
        }
        const role = await this.roleService.findOneById(body.role);
        if (!role) {
            throw new NotFoundException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
                message: 'role.error.notFound',
            });
        }

        try {
            const password = await this.authService.createPassword(
                body.password
            );

            const create = await this.userService.create({
                fullName: body.fullName,
                codeAM: body.codeAM,
                codeDepartmentLevelSix: body.codeDepartmentLevelSix,
                codeLevelSix: body.codeLevelSix,
                position: body.position,
                department: body.department,
                codeEmployee: body.codeEmployee,
                role: body.role,
                password: password.passwordHash,
                passwordExpired: password.passwordExpired,
                salt: password.salt,
            });

            return {
                _id: create._id,
            };
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }

    @Response('user.update')
    @UserUpdateGuard()
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE, ENUM_PERMISSIONS.SETTING_UPDATE)
    @ErrorMeta(UserAdminController.name, 'update')
    @Put('/update')
    async update(
        @GetUser() user: IUserDocument,
        @Body()
            body: UserUpdateCodeDto
    ): Promise<IResponse> {
        try {
            await this.userService.updateUserByCodeEmployee(body.codeEmployee, body);
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: user._id,
        };
    }

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
