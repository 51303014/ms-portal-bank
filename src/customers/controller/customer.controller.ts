import {
    Body,
    Controller, ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException, NotFoundException,
    Post, Query, UnsupportedMediaTypeException,
    UploadedFile, UseInterceptors,
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {AwsS3Service} from 'src/aws/service/aws.s3.service';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {ENUM_FILE_IMAGE_MIME, ENUM_FILE_STATUS_CODE_ERROR} from 'src/utils/file/file.constant';
import {ResponseCustom, ResponsePaging} from 'src/utils/response/response.decorator';
import {IResponse, IResponsePaging} from 'src/utils/response/response.interface';
import {CustomerService} from "../service/customer.service";
import {GetUser, UserProfileGuard} from "../customer.decorator";
import {CustomerFile, ICustomerCreate, ICustomerDocument, SheetName} from "../customer.interface";
import Excel from 'exceljs';
import {HelperFileService} from "../../utils/helper/service/helper.file.service";
import {ENUM_USER_STATUS_CODE_ERROR} from "../customer.constant";
import {IncomeService} from "../../income/service/income.service";
import {IIncomeCreate} from "../../income/income.interface";
import {CardService} from "../../card/service/card.service";
import {TYPE_CARD} from "../../card/card.constant";
import {AssetService} from "../../assetSpecial/service/asset.service";
import {ICardCreate} from "../../card/card.interface";
import {IAssetCreate} from "../../assetSpecial/asset.interface";
import {ParentService} from "../../parents/service/parent.service";
import {IParentCreate} from "../../parents/parent.interface";
import {CompanyService} from "../../company/service/company.service";
import {ICompanyCreate} from "../../company/company.interface";
import {WorkCustomerService} from "../../workCustomer/service/workCustomer.service";
import {IWorkCustomerCreate} from "../../workCustomer/workCustomer.interface";
import {OtherInfoService} from "../../otherInfoCustomer/service/otherInfo.service";
import {IOtherInfoCustomerCreate} from "../../otherInfoCustomer/otherInfo.interface";
import {PaginationService} from "../../pagination/service/pagination.service";
import {IUserDocument} from "../../user/user.interface";
import {CustomerDocument} from "../schema/customer.schema";
import {IncomeDocument} from "../../income/schema/income.schema";
import {CustomerListSerialization} from "../serialization/customer.list.serialization";
import {ADMIN_USER} from "../../user/user.constant";
import LocalFilesInterceptor from "../../utils/file/interceptor/file.local.interceptor";
import bytes from 'bytes';
import {HelperDateService} from "../../utils/helper/service/helper.date.service";
import { HistoryCustomerService } from '../../historyCustomer/service/historyCustomer.service';

@Controller({
    version: '1',
    path: 'customer',
})
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService,
        private readonly assetService: AssetService,
        private readonly parentService: ParentService,
        private readonly companyService: CompanyService,
        private readonly workCustomerService: WorkCustomerService,
        private readonly otherInfoService: OtherInfoService,
        private readonly incomeService: IncomeService,
        private readonly historyCustomerService: HistoryCustomerService,
        private readonly cardService: CardService,
        private readonly awsService: AwsS3Service,
        private readonly fileHelperService: HelperFileService,
        private readonly paginationService: PaginationService,
        private readonly helperDateService: HelperDateService,
    ) {
    }

    @ResponseCustom('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(CustomerController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: ICustomerDocument): Promise<IResponse> {
        return this.customerService.serializationProfile(user);
    }

    async handleRole(user: IUserDocument, role: string): Promise<IncomeDocument[]> {
        if (role === 'manager') {
            let listIncome: IncomeDocument[] = await this.incomeService.findAll();
            listIncome = listIncome.filter(v => user.codeLevelSix.includes(v.codeDepartmentLevelSix));
            return listIncome;
        }
        if (role === 'user') {
            return await this.incomeService.findAll({codeAM: user.codeAM})
        }
        return await this.incomeService.findAll({codeDepartmentLevelSix: user.codeDepartmentLevelSix});

    }

    @ResponsePaging('customer.list')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(CustomerController.name, 'list-customer')
    @Get('/list-customer')
    async getListCustomer(
        @GetUser() user: IUserDocument,
        @Query()
            {
                date,
                filter,
                page,
                perPage,
            }
    ): Promise<IResponsePaging> {
        const skip: number = await this.paginationService.skip(page, perPage);
        const find: Record<string, any> = {};
        switch (filter) {
            case 'day':
                find['$expr'] = {
                    "$and": [
                        {"$eq": [{"$dayOfMonth": "$effectiveDate"}, {"$dayOfMonth": new Date(date)}]},
                    ]
                };
                break;
            case 'month':
                find['$expr'] = {
                    "$and": [
                        {"$eq": [{"$month": "$effectiveDate"}, {"$month": new Date(date)}]},
                    ]
                };
                break;
            case 'year':
                find['$expr'] = {
                    "$and": [
                        {"$eq": [{"$year": "$effectiveDate"}, {"$year": new Date(date)}]},
                    ]
                };
                break;
            default:
        }
        const incomeInfo: IncomeDocument[] = await this.handleRole(user, user?.role?.name);
        let customerInfo: CustomerDocument[] = await this.customerService.findAll(find, {
            limit: perPage,
            skip: skip,
        })
        if (user?.role?.name !== 'admin') {
            customerInfo = customerInfo.filter(value => {
                for (const element of incomeInfo) {
                    if (element.cif === value.cif)
                        return value
                }
            });
        }
        if (!customerInfo.length) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'customerInfo.error.notFound',
            });
        }
        try {
            const totalData: number = customerInfo.length;
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
        } catch (error) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }


    @ResponsePaging('customer-birthday.list')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(CustomerController.name, 'customer-get-list-birthday')
    @Get('/list-birthday')
    async getCustomerBirthDay(
        @GetUser() user: IUserDocument,
        @Query()
            {
                search,
                page,
                perPage,
            }
    ): Promise<IResponsePaging> {
        if (ADMIN_USER.includes(user?.role?.name)) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'role.error.invalid',
            });
        }
        const skip: number = await this.paginationService.skip(page, perPage);

        try {
            const find: Record<string, any> = {};
            if (search) {
                find['$expr'] = {
                    "$and": [
                        {"$eq": [{"$month": "$birthday"}, {"$month": new Date()}]},
                        {"$eq": [{"$dayOfMonth": "$birthday"}, {"$dayOfMonth": this.helperDateService.addDays(new Date(search), 1)}]},

                    ]
                };
            } else {
                find['$expr'] = {
                    "$and": [
                        {"$eq": [{"$month": "$birthday"}, {"$month": new Date()}]},
                    ]
                };
            }

            const incomeInfo: IncomeDocument[] = user?.role?.name === 'user' ? await this.incomeService.findAll({codeAM: user.codeAM},
                {
                    skip: skip,
                    limit: +perPage,
                    currentPage: +page,
                }) :
                await this.incomeService.findAll({codeDepartmentLevelSix: user.codeDepartmentLevelSix},
                    {
                        skip: skip,
                        limit: +perPage,
                        currentPage: +page,
                    });
            let customerInfo: CustomerDocument[] = await this.customerService.findAll(find,
                {
                    skip: skip,
                    limit: +perPage,
                    currentPage: +page,
                });
            if (user?.role?.name !== 'admin') {
                customerInfo = customerInfo.filter(value => {
                    for (const element of incomeInfo) {
                        if (element.cif === value.cif)
                            return value
                    }
                });
            }

            if (!customerInfo.length) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                    message: 'customerInfo.error.notFound',
                });
            }
            const totalData: number = customerInfo.length;
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
        } catch (error) {
            if (error?.status === 404) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                    message: 'customerInfo.error.notFound',
                });
            }
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }

    @ResponseCustom('customer.upload')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @UseInterceptors(LocalFilesInterceptor({
        fieldName: 'file',
        path: '/customer',
        fileFilter: (request, file, callback) => {
            if (!Object.values(ENUM_FILE_IMAGE_MIME).find(
                (val) => val === file.mimetype.toLowerCase()
            )) {
                throw new UnsupportedMediaTypeException({
                    statusCode:
                    ENUM_FILE_STATUS_CODE_ERROR.FILE_EXTENSION_ERROR,
                    message: 'file.error.mimeInvalid',
                });
            }
            callback(null, true);
        },
        limits: {
            fileSize: bytes('10000kb') // 10MB
        }
    }))
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(CustomerController.name, 'upload')
    @Post('/upload')
    async upload(
        @GetUser() user: ICustomerDocument,
        @Body() customerFile: CustomerFile,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        const workbook = new Excel.Workbook();
        const content = await workbook.xlsx.readFile(file.path);
        if (!customerFile || !SheetName[customerFile.fileType]) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'fileType.error.notFound',
            });
        }
        try {
            switch (customerFile.fileType) {
                case SheetName.InfoCustomerMis:
                    const worksheet = content.getWorksheet(1);
                    const rowStartIndex = 2;
                    const numberOfRows = worksheet.rowCount - 1;
                    const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];

                    await Promise.all([rows.map(async row => {
                        try {
                            const infoCustomer: ICustomerCreate = {
                                user: user._id,
                                cif: this.fileHelperService.getCellValue(row, 1),
                                fullName: this.fileHelperService.getCellValue(row, 2),
                                brandCifOpen: +this.fileHelperService.getCellValue(row, 3),
                                dateCifOpen: this.fileHelperService.getCellValueCommon(row, 4) ? new Date(this.fileHelperService.getCellValueCommon(row, 4)) : null,
                                nationality: this.fileHelperService.getCellValue(row, 5),
                                address: this.fileHelperService.getCellValue(row, 6),
                                residence: this.fileHelperService.getCellValue(row, 7),
                                birthday: this.fileHelperService.getCellValueCommon(row, 8) ? new Date(this.fileHelperService.getCellValueCommon(row, 8)) : null,
                                birthPlace: this.fileHelperService.getCellValue(row, 9),
                                customerId: this.fileHelperService.getCellValue(row, 10),
                                numberIdentity: this.fileHelperService.getCellValue(row, 11),
                                effectiveDate: this.fileHelperService.getCellValueCommon(row, 12) ? new Date(this.fileHelperService.getCellValueCommon(row, 12)) : null,
                                age: +this.fileHelperService.getCellValue(row, 13),
                                email: this.fileHelperService.getCellValue(row, 14),
                                mobile: this.fileHelperService.getCellValue(row, 15),
                                gender: this.fileHelperService.getCellValue(row, 16),
                                job: this.fileHelperService.getCellValue(row, 18),
                                relationshipBank: this.fileHelperService.getCellValue(row, 19),
                                currentStatus: this.fileHelperService.getCellFormulaValue(row, 20) ? this.fileHelperService.getCellFormulaValue(row, 20) : this.fileHelperService.getCellValue(row, 20),
                                previousStatus: this.fileHelperService.getCellFormulaValue(row, 21) ? this.fileHelperService.getCellFormulaValue(row, 21) : this.fileHelperService.getCellValue(row, 21),
                                statusChangeDate: this.fileHelperService.getCellValue(row, 22),
                                customerType: this.fileHelperService.getCellValue(row, 23),
                                customerSegment: this.fileHelperService.getCellValue(row, 24),
                                creditBalanceSegment: this.fileHelperService.getCellValue(row, 25),
                                depositBalanceSegment: this.fileHelperService.getCellValue(row, 26),
                                debtGroup: this.fileHelperService.getCellValue(row, 27),
                                incomeBrandYearly: this.fileHelperService.getCellValue(row, 28),
                                incomeTotalYearly: this.fileHelperService.getCellValue(row, 29),
                                createdDate: this.fileHelperService.getCellValueCommon(row, 30) ? new Date(this.fileHelperService.getCellValueCommon(row, 30)) : null,
                            }
                            const customerInfo: ICustomerCreate = await this.customerService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 1)
                            });
                            if (customerInfo) {
                                await this.customerService.updateOneByInfoCustomerMis(customerInfo.cif, infoCustomer)
                                return;
                            }
                            return await this.customerService.create(infoCustomer);
                        } catch (error) {
                            console.log(error);
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }
                    })
                    ])
                    break;
                case SheetName.InfoCustomer:
                    const worksheetInfoCustomer = content.getWorksheet(1);
                    const rowStartIndexInfoCustomer = 2;
                    const numberOfRowsInfoCustomer = worksheetInfoCustomer.rowCount - 1;
                    const rowsInfoCustomer = worksheetInfoCustomer.getRows(rowStartIndexInfoCustomer, numberOfRowsInfoCustomer) ?? [];

                    await Promise.all([rowsInfoCustomer.map(async row => {
                        try {
                            const infoCustomer: ICustomerCreate = {
                                user: user._id,
                                cif: this.fileHelperService.getCellValue(row, 1),
                                creditLimitCustomer: this.fileHelperService.getCellValue(row, 2),
                                totalCreditBalanceLastYear: this.fileHelperService.getCellValue(row, 3),
                                totalCreditBalanceEndDay: this.fileHelperService.getCellValue(row, 4),
                                totalCreditBalanceAvgBeginYear: +this.fileHelperService.getCellValue(row, 5),
                                balanceDebtLastYear: this.fileHelperService.getCellValue(row, 6),
                                balanceDebtEndDay: this.fileHelperService.getCellValue(row, 7),
                                balanceCreditLastYear: this.fileHelperService.getCellValue(row, 8),
                                balanceCreditEndDay: this.fileHelperService.getCellValue(row, 9),
                                overdraftBalanceLastYear: this.fileHelperService.getCellValue(row, 10),
                                overdraftBalanceEndDay: this.fileHelperService.getCellValue(row, 11),
                                totalDepositBalanceLastYear: this.fileHelperService.getCellValue(row, 12),
                                totalDepositBalanceEndDay: this.fileHelperService.getCellValue(row, 13),
                                totalDepositBalanceAvgBeginYear: this.fileHelperService.getCellValue(row, 14),
                                paymentBalanceDepositLastYear: this.fileHelperService.getCellValue(row, 15),
                                paymentBalanceDepositEndDay: this.fileHelperService.getCellValue(row, 16),
                                termDepositBalanceLastYear: this.fileHelperService.getCellValue(row, 17),
                                termDepositBalanceEndDay: this.fileHelperService.getCellValue(row, 18),
                                totalCreditBalanceAvgLastYear: +this.fileHelperService.getCellValue(row, 19),
                                totalDepositBalanceAvgLastYear: +this.fileHelperService.getCellValue(row, 20)
                            }
                            const customerInfo: ICustomerCreate = await this.customerService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 1)
                            });
                            if (customerInfo) {
                                await this.customerService.updateOneById(customerInfo.cif, infoCustomer)
                                return;
                            }
                            return await this.customerService.create(infoCustomer);
                        } catch (error) {
                            console.log(error);
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }
                    })
                    ])
                    break;
                case SheetName.InfoCustomerMisLastYear:
                    const worksheetInfoCustomerMisLastYear = content.getWorksheet(1);
                    const rowStartInfoCustomerMisLastYear = 2;
                    const numberOfRowsInfoCustomerMisLastYear = worksheetInfoCustomerMisLastYear.rowCount - 1;
                    const rowsInfoCustomerMisLastYear = worksheetInfoCustomerMisLastYear.getRows(rowStartInfoCustomerMisLastYear, numberOfRowsInfoCustomerMisLastYear) ?? [];

                    await Promise.all([rowsInfoCustomerMisLastYear.map(async row => {
                        try {
                            const infoCustomer: ICustomerCreate = {
                                user: user._id,
                                incomeBrandLastYear: this.fileHelperService.getCellValue(row, 2),
                                incomeTotalLastYear: this.fileHelperService.getCellValue(row, 3),
                            }
                            const customerInfo: ICustomerCreate = await this.customerService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 1)
                            });
                            if (customerInfo) {
                                await this.customerService.updateOneByInfoCustomerMisLastYear(customerInfo.cif, infoCustomer)
                                return;
                            }
                            return await this.customerService.create(infoCustomer);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }
                    })
                    ])
                    break;
                case SheetName.InfoCustomerIncomeScale:
                    const worksheetInfoCustomerIncomeScale = content.getWorksheet(1);
                    const rowStartInfoCustomerIncomeScale = 2;
                    const numberOfRowsInfoCustomerIncomeScale = worksheetInfoCustomerIncomeScale.rowCount - 1;
                    const rowsInfoCustomerIncomeScale = worksheetInfoCustomerIncomeScale.getRows(rowStartInfoCustomerIncomeScale, numberOfRowsInfoCustomerIncomeScale) ?? [];

                    await Promise.all([rowsInfoCustomerIncomeScale.map(async row => {
                        try {
                            if (!this.fileHelperService.getCellValue(row, 2)) {
                                return;
                            }
                            const infoCustomer: IIncomeCreate = {
                                user: user._id,
                                codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 1),
                                codeAM: this.fileHelperService.getCellValue(row, 2),
                                cif: this.fileHelperService.getCellValue(row, 3),
                                fullName: this.fileHelperService.getCellValue(row, 4),
                                kindOfMoney: this.fileHelperService.getCellValue(row, 5),
                                raisingCapitalAtTheEnd: this.fileHelperService.getCellValue(row, 6) ? +this.fileHelperService.getCellValue(row, 6) : 0,
                                raisingCapitalAtTheEndExchange: this.fileHelperService.getCellValue(row, 7) ? +this.fileHelperService.getCellValue(row, 7) : 0,
                                raisingCapitalAtTheEndKKH: this.fileHelperService.getCellValue(row, 8) ? +this.fileHelperService.getCellValue(row, 8) : 0,
                                raisingCapitalAtTheEndKKHExchange: this.fileHelperService.getCellValue(row, 9) ? +this.fileHelperService.getCellValue(row, 9) : 0,
                                raisingCapitalAtTheEndCKH: this.fileHelperService.getCellValue(row, 10) ? +this.fileHelperService.getCellValue(row, 10) : 0,
                                raisingCapitalAtTheEndCKHExchange: this.fileHelperService.getCellValue(row, 11) ? +this.fileHelperService.getCellValue(row, 11) : 0,
                                raisingCapitalAvg: this.fileHelperService.getCellValue(row, 12) ? +this.fileHelperService.getCellValue(row, 12) : 0,
                                raisingCapitalAvgExchange: this.fileHelperService.getCellValue(row, 13) ? +this.fileHelperService.getCellValue(row, 13) : 0,
                                raisingCapitalKKHAvg: this.fileHelperService.getCellValue(row, 14) ? +this.fileHelperService.getCellValue(row, 14) : 0,
                                raisingCapitalKKHAvgExchange: this.fileHelperService.getCellValue(row, 15) ? +this.fileHelperService.getCellValue(row, 15) : 0,
                                raisingCapitalCKHAvg: this.fileHelperService.getCellValue(row, 16) ? +this.fileHelperService.getCellValue(row, 16) : 0,
                                raisingCapitalCKHAvgExchange: this.fileHelperService.getCellValue(row, 17) ? +this.fileHelperService.getCellValue(row, 17) : 0,
                                amountDebtCreditAtTheEnd: this.fileHelperService.getCellValue(row, 18) ? +this.fileHelperService.getCellValue(row, 18) : 0,
                                amountDebtCreditAtTheEndExchange: this.fileHelperService.getCellValue(row, 19) ? +this.fileHelperService.getCellValue(row, 19) : 0,
                                amountDebtCreditTDHAtTheEnd: this.fileHelperService.getCellValue(row, 20) ? +this.fileHelperService.getCellValue(row, 20) : 0,
                                amountDebtCreditTDHAtTheEndExchange: this.fileHelperService.getCellValue(row, 21) ? +this.fileHelperService.getCellValue(row, 21) : 0,
                                amountDebtCreditAvgAtTheEnd: this.fileHelperService.getCellValue(row, 22) ? +this.fileHelperService.getCellValue(row, 22) : 0,
                                amountDebtCreditAvgAtTheEndExchange: this.fileHelperService.getCellValue(row, 23) ? +this.fileHelperService.getCellValue(row, 23) : 0,
                                amountDebtCreditTDHAvgAtTheEnd: this.fileHelperService.getCellValue(row, 24) ? +this.fileHelperService.getCellValue(row, 24) : 0,
                                amountDebtCreditTDHAvgAtTheEndExchange: this.fileHelperService.getCellValue(row, 25) ? +this.fileHelperService.getCellValue(row, 25) : 0,
                                amountDebtLoanGTCGAndEndCard: this.fileHelperService.getCellValue(row, 26) ? +this.fileHelperService.getCellValue(row, 26) : 0,
                                amountDebtLoanGTCGAndAvgCard: this.fileHelperService.getCellValue(row, 27) ? +this.fileHelperService.getCellValue(row, 27) : 0,
                                incomeFTPBaseMore: this.fileHelperService.getCellValue(row, 28) ? +this.fileHelperService.getCellValue(row, 28) : 0,
                                incomeFromInterestFTPBaseMore: this.fileHelperService.getCellValue(row, 29) ? +this.fileHelperService.getCellValue(row, 29) : 0,
                                incomeFromCreditFTPBaseMore: this.fileHelperService.getCellValue(row, 30) ? +this.fileHelperService.getCellValue(row, 30) : 0,
                                incomeGuaranteeActivities: this.fileHelperService.getCellValue(row, 31) ? +this.fileHelperService.getCellValue(row, 31) : 0,
                                incomeHDVFTPBaseMore: this.fileHelperService.getCellValue(row, 32) ? +this.fileHelperService.getCellValue(row, 32) : 0,
                                incomeOtherInterest: this.fileHelperService.getCellValue(row, 33) ? +this.fileHelperService.getCellValue(row, 33) : 0,
                                incomeExcludeInterest: this.fileHelperService.getCellValue(row, 34) ? +this.fileHelperService.getCellValue(row, 34) : 0,
                                incomeFromService: this.fileHelperService.getCellValue(row, 35) ? +this.fileHelperService.getCellValue(row, 35) : 0,
                                incomeFromToolFinance: this.fileHelperService.getCellValue(row, 36) ? +this.fileHelperService.getCellValue(row, 36) : 0,
                                incomeBuyStock: this.fileHelperService.getCellValue(row, 37) ? +this.fileHelperService.getCellValue(row, 37) : 0,
                                incomeBuySharesAndContribution: this.fileHelperService.getCellValue(row, 38) ? +this.fileHelperService.getCellValue(row, 38) : 0,
                                incomeGolden: this.fileHelperService.getCellValue(row, 39) ? +this.fileHelperService.getCellValue(row, 39) : 0,
                                incomeInterestKDNTPS: this.fileHelperService.getCellValue(row, 40) ? +this.fileHelperService.getCellValue(row, 40) : 0,
                                incomeExcludeInterestKDNTPS: this.fileHelperService.getCellValue(row, 41) ? +this.fileHelperService.getCellValue(row, 41) : 0,
                                incomeFromCardAndInterestService: this.fileHelperService.getCellValue(row, 42) ? +this.fileHelperService.getCellValue(row, 42) : 0,
                                incomeFromCardService: this.fileHelperService.getCellValue(row, 43) ? +this.fileHelperService.getCellValue(row, 43) : 0,
                                incomeFromCardInterest: this.fileHelperService.getCellValue(row, 44) ? +this.fileHelperService.getCellValue(row, 44) : 0,
                                incomeFromDebtCurrency: this.fileHelperService.getCellValue(row, 45) ? +this.fileHelperService.getCellValue(row, 45) : 0,
                                incomeOtherActivity: this.fileHelperService.getCellValue(row, 46) ? +this.fileHelperService.getCellValue(row, 46) : 0,
                                incomeCreateDated: this.fileHelperService.getCellValueCommon(row, 47) ? new Date(this.fileHelperService.getCellValueCommon(row, 47)) : null
                            }
                            const incomeInfo: IIncomeCreate = await this.incomeService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 3),
                                codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 1),
                                kindOfMoney: this.fileHelperService.getCellValue(row, 5),
                                codeAM: this.fileHelperService.getCellValue(row, 2)
                            });
                            await this.historyCustomerService.create(infoCustomer);
                            if (incomeInfo) {
                                await this.incomeService.updateOneByIdInfoCustomerIncomeScale(incomeInfo.cif, infoCustomer)
                                return;
                            }
                            return await this.incomeService.create(infoCustomer);
                        } catch (error) {
                            console.log(error);
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    })
                    ])
                   
                    break;
                case SheetName.InfoCustomerIncomeScaleLastYear:
                    const worksheetInfoCustomerIncomeScaleLastYear = content.getWorksheet(1);
                    const rowStartInfoCustomerIncomeScaleLastYear = 2;
                    const numberOfRowsInfoCustomerIncomeScaleLastYear = worksheetInfoCustomerIncomeScaleLastYear.rowCount - 1;
                    const rowsInfoCustomerIncomeScaleLastYear = worksheetInfoCustomerIncomeScaleLastYear.getRows(rowStartInfoCustomerIncomeScaleLastYear, numberOfRowsInfoCustomerIncomeScaleLastYear) ?? [];

                    await Promise.all([rowsInfoCustomerIncomeScaleLastYear.map(async row => {
                        try {
                            if (!this.fileHelperService.getCellValue(row, 2)) {
                                return;
                            }
                            const infoCustomer: IIncomeCreate = {
                                user: user._id,
                                codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 1),
                                codeAM: this.fileHelperService.getCellValue(row, 2),
                                cif: this.fileHelperService.getCellValue(row, 3),
                                fullName: this.fileHelperService.getCellValue(row, 4),
                                kindOfMoney: this.fileHelperService.getCellValue(row, 5),
                                raisingCapitalAtTheEndLastYear: this.fileHelperService.getCellValue(row, 6) ? +this.fileHelperService.getCellValue(row, 6) : 0,
                                raisingCapitalAtTheEndExchangeLastYear: this.fileHelperService.getCellValue(row, 7) ? +this.fileHelperService.getCellValue(row, 7) : 0,
                                raisingCapitalAtTheEndKKHLastYear: this.fileHelperService.getCellValue(row, 8) ? +this.fileHelperService.getCellValue(row, 8) : 0,
                                raisingCapitalAtTheEndKKHExchangeLastYear: +this.fileHelperService.getCellValue(row, 9),
                                raisingCapitalAtTheEndCKHLastYear: +this.fileHelperService.getCellValue(row, 10),
                                raisingCapitalAtTheEndCKHExchangeLastYear: +this.fileHelperService.getCellValue(row, 11),
                                raisingCapitalAvgLastYear: +this.fileHelperService.getCellValue(row, 12),
                                raisingCapitalAvgExchangeLastYear: +this.fileHelperService.getCellValue(row, 13),
                                raisingCapitalKKHAvgLastYear: +this.fileHelperService.getCellValue(row, 14),
                                raisingCapitalKKHAvgExchangeLastYear: +this.fileHelperService.getCellValue(row, 15),
                                raisingCapitalCKHAvgLastYear: +this.fileHelperService.getCellValue(row, 16),
                                raisingCapitalCKHAvgExchangeLastYear: +this.fileHelperService.getCellValue(row, 17),
                                amountDebtCreditAtTheEndLastYear: +this.fileHelperService.getCellValue(row, 18),
                                amountDebtCreditAtTheEndExchangeLastYear: +this.fileHelperService.getCellValue(row, 19),
                                amountDebtCreditTDHAtTheEndLastYear: +this.fileHelperService.getCellValue(row, 20),
                                amountDebtCreditTDHAtTheEndExchangeLastYear: +this.fileHelperService.getCellValue(row, 21),
                                amountDebtCreditAvgAtTheEndLastYear: +this.fileHelperService.getCellValue(row, 22),
                                amountDebtCreditAvgAtTheEndExchangeLastYear: +this.fileHelperService.getCellValue(row, 23),
                                amountDebtCreditTDHAvgAtTheEndLastYear: +this.fileHelperService.getCellValue(row, 24),
                                amountDebtCreditTDHAvgAtTheEndExchangeLastYear: +this.fileHelperService.getCellValue(row, 25),
                                amountDebtLoanGTCGAndEndCardLastYear: +this.fileHelperService.getCellValue(row, 26),
                                amountDebtLoanGTCGAndAvgCardLastYear: +this.fileHelperService.getCellValue(row, 27),
                                incomeFTPBaseMoreLastYear: +this.fileHelperService.getCellValue(row, 28),
                                incomeFromInterestFTPBaseMoreLastYear: +this.fileHelperService.getCellValue(row, 29),
                                incomeFromCreditFTPBaseMoreLastYear: +this.fileHelperService.getCellValue(row, 30),
                                incomeGuaranteeActivitiesLastYear: +this.fileHelperService.getCellValue(row, 31),
                                incomeHDVFTPBaseMoreLastYear: +this.fileHelperService.getCellValue(row, 32),
                                incomeOtherInterestLastYear: +this.fileHelperService.getCellValue(row, 33),
                                incomeExcludeInterestLastYear: +this.fileHelperService.getCellValue(row, 34),
                                incomeFromServiceLastYear: +this.fileHelperService.getCellValue(row, 35),
                                incomeFromToolFinanceLastYear: +this.fileHelperService.getCellValue(row, 36),
                                incomeBuyStockLastYear: +this.fileHelperService.getCellValue(row, 37),
                                incomeBuySharesAndContributionLastYear: +this.fileHelperService.getCellValue(row, 38),
                                incomeGoldenLastYear: +this.fileHelperService.getCellValue(row, 39),
                                incomeInterestKDNTPSLastYear: +this.fileHelperService.getCellValue(row, 40),
                                incomeExcludeInterestKDNTPSLastYear: +this.fileHelperService.getCellValue(row, 41),
                                incomeFromCardAndInterestServiceLastYear: +this.fileHelperService.getCellValue(row, 42),
                                incomeFromCardServiceLastYear: +this.fileHelperService.getCellValue(row, 43),
                                incomeFromCardInterestLastYear: +this.fileHelperService.getCellValue(row, 44),
                                incomeFromDebtCurrencyLastYear: +this.fileHelperService.getCellValue(row, 45),
                                incomeOtherActivityLastYear: +this.fileHelperService.getCellValue(row, 46),
                                incomeCreateDatedLastYear: this.fileHelperService.getCellValueCommon(row, 47) ? new Date(this.fileHelperService.getCellValueCommon(row, 47)) : null
                            }
                            const incomeInfo: IIncomeCreate = await this.incomeService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 3),
                                codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 1),
                                kindOfMoney: this.fileHelperService.getCellValue(row, 5),
                                codeAM: this.fileHelperService.getCellValue(row, 2)
                            });
                            if (incomeInfo) {
                                await this.incomeService.updateOneByInfoCustomerIncomeScaleLastYear(incomeInfo.cif, infoCustomer)
                                return;
                            }
                            return await this.incomeService.create(infoCustomer);
                        } catch (error) {
                            console.log(error)
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    })
                    ])
                    break;
                case SheetName.InfoCustomerCoreDebt:
                    const worksheetInfoCustomerCoreDebt = content.getWorksheet(1);
                    const rowStartInfoCustomerCoreDebt = 2;
                    const numberOfRowsInfoCustomerCoreDebt = worksheetInfoCustomerCoreDebt.rowCount - 1;
                    const rowsInfoCustomerCoreDebt = worksheetInfoCustomerCoreDebt.getRows(rowStartInfoCustomerCoreDebt, numberOfRowsInfoCustomerCoreDebt) ?? [];

                    await Promise.all([rowsInfoCustomerCoreDebt.map(async row => {
                        try {
                            const infoCustomer: ICustomerCreate = {
                                user: user._id,
                                cif: this.fileHelperService.getCellValue(row, 3),
                                codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 5),
                                coreDebt: +this.fileHelperService.getCellValue(row, 10) - +this.fileHelperService.getCellValue(row, 9)
                            }
                            const customerInfo: ICustomerCreate = await this.customerService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 3)
                            });
                            let total = 0;
                            if (customerInfo) {
                                total += infoCustomer.coreDebt;
                                await this.customerService.updateOneByInfoCustomerCoreDebt(customerInfo.cif, SheetName.InfoCustomerCoreDebt, total)
                                return;
                            }
                            return await this.customerService.create(infoCustomer);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    })
                    ])
                    break;

                case SheetName.InfoCustomerCoreDebtLastYear:
                    const worksheetInfoCustomerCoreDebtLastYear = content.getWorksheet(1);
                    const rowStartInfoCustomerCoreDebtLastYear = 2
                    const numberOfRowsInfoCustomerCoreDebtLastYear = worksheetInfoCustomerCoreDebtLastYear.rowCount - 1;
                    const rowsInfoCustomerCoreDebtLastYear = worksheetInfoCustomerCoreDebtLastYear.getRows(rowStartInfoCustomerCoreDebtLastYear, numberOfRowsInfoCustomerCoreDebtLastYear) ?? [];

                    await Promise.all([rowsInfoCustomerCoreDebtLastYear.map(async row => {
                        try {
                            const infoCustomer: ICustomerCreate = {
                                user: user._id,
                                cif: this.fileHelperService.getCellValue(row, 3),
                                codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 5),
                                coreDebtLastYear: +this.fileHelperService.getCellValue(row, 10) - +this.fileHelperService.getCellValue(row, 9)
                            }
                            const customerInfo: ICustomerCreate = await this.customerService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 3)
                            });
                            let total = 0;

                            if (customerInfo) {
                                total += infoCustomer.coreDebtLastYear;
                                await this.customerService.updateOneByInfoCustomerCoreDebt(customerInfo.cif, SheetName.InfoCustomerCoreDebtLastYear, total)
                                return;
                            }
                            return await this.customerService.create(infoCustomer);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    })
                    ])
                    break;
                case SheetName.InfoDebitDomesticCard:
                    const worksheetInfoDebitDomesticCard = content.getWorksheet(1);
                    const rowStartInfoDebitDomesticCard = 2
                    const numberOfRowsInfoDebitDomesticCard = worksheetInfoDebitDomesticCard.rowCount - 1;
                    const rowsInfoDebitDomesticCard = worksheetInfoDebitDomesticCard.getRows(rowStartInfoDebitDomesticCard, numberOfRowsInfoDebitDomesticCard) ?? [];

                    await Promise.all([rowsInfoDebitDomesticCard.map(async row => {
                        try {
                            const infoCard: ICardCreate = {
                                user: user._id,
                                typeCard: TYPE_CARD.DebitDomesticCard,
                                cif: this.fileHelperService.getCellFormulaValue(row, 1) ? this.fileHelperService.getCellFormulaValue(row, 1) : this.fileHelperService.getCellValue(row, 1),
                                fullName: this.fileHelperService.getCellValue(row, 2),
                                accountNumberDebitDomestic: this.fileHelperService.getCellValue(row, 3),
                                cardNumberDebitDomestic: this.fileHelperService.getCellValue(row, 4),
                                typeProductDebitDomestic: this.fileHelperService.getCellValue(row, 5),
                                typeChipDebitDomestic: this.fileHelperService.getCellValue(row, 6),
                                codeDebitDomestic: this.fileHelperService.getCellFormulaValue(row, 7) ? this.fileHelperService.getCellFormulaValue(row, 7) : this.fileHelperService.getCellValue(row, 7),
                                statusDebitDomestic: this.fileHelperService.getCellFormulaValue(row, 8) ? this.fileHelperService.getCellFormulaValue(row, 8) : this.fileHelperService.getCellValue(row, 8),
                                formPHTDebitDomestic: this.fileHelperService.getCellValue(row, 9),
                                codeAM: this.fileHelperService.getCellFormulaValue(row, 10) ? this.fileHelperService.getCellFormulaValue(row, 10) : this.fileHelperService.getCellValue(row, 10)
                            }
                            const info: ICardCreate = await this.cardService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 1),
                                typeCard: TYPE_CARD.DebitDomesticCard,
                                fullName: this.fileHelperService.getCellValue(row, 2),
                                cardNumberDebitDomestic: this.fileHelperService.getCellValue(row, 4)
                            });
                            if (info) {
                                await this.cardService.updateOneByInfoDebitDomesticCard(info.cif, info)
                                return;
                            }
                            return await this.cardService.create(infoCard);
                        } catch (error) {
                            console.log(error)
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    })
                    ])
                    break;
                case SheetName.InfoDebitInternationalCard:
                    const worksheetInfoDebitInternationalCard = content.getWorksheet(1);
                    const rowStartInfoDebitInternationalCard = 2
                    const numberOfRowsInfoDebitInternationalCard = worksheetInfoDebitInternationalCard.rowCount - 1;
                    const rowsInfoDebitInternationalCard = worksheetInfoDebitInternationalCard.getRows(rowStartInfoDebitInternationalCard, numberOfRowsInfoDebitInternationalCard) ?? [];

                    await Promise.all([rowsInfoDebitInternationalCard.map(async row => {
                        try {
                            const infoCard: ICardCreate = {
                                user: user._id,
                                typeCard: TYPE_CARD.DebitInternationalCard,
                                cif: this.fileHelperService.getCellFormulaValue(row, 1) ? this.fileHelperService.getCellFormulaValue(row, 1) : this.fileHelperService.getCellValue(row, 1),
                                fullName: this.fileHelperService.getCellValue(row, 2),
                                cardNumberDebitInternational: this.fileHelperService.getCellValue(row, 3),
                                accountNumberDefaultLinkedCard: this.fileHelperService.getCellValue(row, 4),
                                amountFeeAnnually: this.fileHelperService.getCellValue(row, 5),
                                statusCardDebitInternational: this.fileHelperService.getCellValue(row, 6),
                                expiredDateCardDebitInternational: this.fileHelperService.getCellValue(row, 7) ? new Date(this.fileHelperService.getCellValue(row, 7)) : null,
                                activeDateCardDebitInternational: this.fileHelperService.getCellValue(row, 8) ? new Date(this.fileHelperService.getCellValue(row, 8)) : null,
                                typeCardDebitInternational: this.fileHelperService.getCellValue(row, 9),
                                codeCardDebitInternational: this.fileHelperService.getCellValue(row, 10),
                                codeAM: this.fileHelperService.getCellFormulaValue(row, 11) ? this.fileHelperService.getCellFormulaValue(row, 11) : this.fileHelperService.getCellValue(row, 11)
                            }
                            const info: ICardCreate = await this.cardService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 1),
                                typeCard: TYPE_CARD.DebitInternationalCard,
                                fullName: this.fileHelperService.getCellValue(row, 2),
                                cardNumberDebitInternational: this.fileHelperService.getCellValue(row, 3)
                            });
                            if (info) {
                                await this.cardService.updateOneByInfoDebitInternationalCard(info.cif, info)
                                return;
                            }
                            return await this.cardService.create(infoCard);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    })
                    ])
                    break;
                case SheetName.InfoDetailTSDB:
                    const worksheetInfoDetailTSDB = content.getWorksheet(1);
                    const rowStartInfoDetailTSDB = 3
                    const numberOfRowsInfoDetailTSDB = worksheetInfoDetailTSDB.rowCount - 2;
                    const rowsInfoDetailTSDB = worksheetInfoDetailTSDB.getRows(rowStartInfoDetailTSDB, numberOfRowsInfoDetailTSDB) ?? [];

                    await Promise.all(rowsInfoDetailTSDB.map(async row => {
                        try {
                            const valueTSDB = +this.fileHelperService.getCellValue(row, 9)
                            const infoAsset: IAssetCreate = {
                                cif: this.fileHelperService.getCellFormulaValue(row, 3) ? this.fileHelperService.getCellFormulaValue(row, 3) : this.fileHelperService.getCellValue(row, 3),
                                codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 2),
                                totalDebtTSDB: this.fileHelperService.getCellValue(row, 5),
                                debtShortTSDB: this.fileHelperService.getCellValue(row, 6),
                                debtMediumTSDB: this.fileHelperService.getCellValue(row, 7),
                                debtLongTSDB: this.fileHelperService.getCellValue(row, 8),
                                valueTSDB,
                                property: this.fileHelperService.getCellValue(row, 10),
                                saveMoney: this.fileHelperService.getCellValue(row, 13),
                                otherAsset: this.fileHelperService.getCellValue(row, 14)
                            }
                            const asset: IAssetCreate = await this.assetService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 3),
                                codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 2),
                                valueTSDB
                            });
                            if (asset) {
                                await this.assetService.updateOneByInfoDetailTSDB(infoAsset.cif, infoAsset)
                                return;
                            }
                            await this.assetService.create(infoAsset);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }
                    }));
                    const assetDetail = await this.assetService.findAllBaseField();
                    assetDetail.map(async (value: any) => {
                        await this.customerService.updateOneByTotalTSDB(value._id, value)
                    })
                    break;
                case SheetName.InfoProductServiceBrand:
                    const worksheetInfoProductServiceBrand = content.getWorksheet(1);
                    const rowStartInfoProductServiceBrand = 2
                    const numberOfRowsInfoProductServiceBrand = worksheetInfoProductServiceBrand.rowCount - 1;
                    const rowsInfoProductServiceBrand = worksheetInfoProductServiceBrand.getRows(rowStartInfoProductServiceBrand, numberOfRowsInfoProductServiceBrand) ?? [];

                    await Promise.all([rowsInfoProductServiceBrand.map(async row => {
                        try {
                            const infoCustomer: ICustomerCreate = {
                                user: user._id,
                                cif: this.fileHelperService.getCellFormulaValue(row, 3) ? this.fileHelperService.getCellFormulaValue(row, 3) : this.fileHelperService.getCellValue(row, 3),
                                fullName: this.fileHelperService.getCellValue(row, 4),
                                codeDepartmentLevelSix: this.fileHelperService.getCellValue(row, 2),
                                productServiceBrandTGCKH: this.fileHelperService.getCellValue(row, 7),
                                productServiceBrandTGTT: this.fileHelperService.getCellValue(row, 8),
                                productServiceBrandLOAN: this.fileHelperService.getCellValue(row, 9),
                                productServiceBrandOverdraft: this.fileHelperService.getCellValue(row, 10),
                                productServiceBrandTTTM: this.fileHelperService.getCellValue(row, 11),
                                productServiceBrandVisaCard: this.fileHelperService.getCellValue(row, 12),
                                productServiceBrandMasterCard: this.fileHelperService.getCellValue(row, 13),
                                productServiceBrandATMCard: this.fileHelperService.getCellValue(row, 14),
                                productServiceBrandRegisterSalary: this.fileHelperService.getCellValue(row, 15),
                                productServiceBrandStock: this.fileHelperService.getCellValue(row, 16),
                                productServiceBrandSmartBanking: this.fileHelperService.getCellValue(row, 17),
                                productServiceBrandBSMS: this.fileHelperService.getCellValue(row, 18),
                                productServiceBrandBANKPlus: this.fileHelperService.getCellValue(row, 19),
                                productServiceBrandVNTopup: this.fileHelperService.getCellValue(row, 20),
                                productServiceBrandCollectAndPay: this.fileHelperService.getCellValue(row, 21),
                                productServiceBrandTCC: this.fileHelperService.getCellValue(row, 22),
                                productServiceBrandIBank: this.fileHelperService.getCellValue(row, 23),
                                productServiceBrandBillElectricUNCAuto: this.fileHelperService.getCellValue(row, 24),
                                productServiceBrandExcludeBillElectricUNCAuto: this.fileHelperService.getCellValue(row, 25),
                                productServiceBrandTotalProductUse: this.fileHelperService.getCellValue(row, 26),
                            }
                            const customerInfo: ICustomerCreate = await this.customerService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 3)
                            });
                            if (customerInfo) {
                                await this.customerService.updateOneByInfoProductServiceBrand(customerInfo.cif, infoCustomer)
                                return;
                            }
                            return await this.customerService.create(infoCustomer);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    })
                    ])
                    break;
                case SheetName.InfoProductServiceSystem:
                    const worksheetInfoProductServiceSystem = content.getWorksheet(1);
                    const rowStartInfoProductServiceSystem = 2
                    const numberOfRowsInfoProductServiceSystem = worksheetInfoProductServiceSystem.rowCount - 1;
                    const rowsInfoProductServiceSystem = worksheetInfoProductServiceSystem.getRows(rowStartInfoProductServiceSystem, numberOfRowsInfoProductServiceSystem) ?? [];

                    await Promise.all([rowsInfoProductServiceSystem.map(async row => {
                        try {
                            const infoCustomer: ICustomerCreate = {
                                user: user._id,
                                cif: this.fileHelperService.getCellFormulaValue(row, 2) ? this.fileHelperService.getCellFormulaValue(row, 2) : this.fileHelperService.getCellValue(row, 2),
                                productServiceSystemTGCKH: this.fileHelperService.getCellValue(row, 7),
                                productServiceSystemTGTT: this.fileHelperService.getCellValue(row, 8),
                                productServiceSystemLOAN: this.fileHelperService.getCellValue(row, 9),
                                productServiceSystemOverdraft: this.fileHelperService.getCellValue(row, 10),
                                productServiceSystemTTTM: this.fileHelperService.getCellValue(row, 11),
                                productServiceSystemVisaCard: this.fileHelperService.getCellValue(row, 12),
                                productServiceSystemMasterCard: this.fileHelperService.getCellValue(row, 13),
                                productServiceSystemATMCard: this.fileHelperService.getCellValue(row, 14),
                                productServiceSystemRegisterSalary: this.fileHelperService.getCellValue(row, 15),
                                productServiceSystemStock: this.fileHelperService.getCellValue(row, 16),
                                productServiceSystemSmartBanking: this.fileHelperService.getCellValue(row, 17),
                                productServiceSystemBSMS: this.fileHelperService.getCellValue(row, 18),
                                productServiceSystemBANKPlus: this.fileHelperService.getCellValue(row, 19),
                                productServiceSystemVNTopup: this.fileHelperService.getCellValue(row, 20),
                                productServiceSystemCollectAndPay: this.fileHelperService.getCellValue(row, 21),
                                productServiceSystemTCC: this.fileHelperService.getCellValue(row, 22),
                                productServiceSystemIBank: this.fileHelperService.getCellValue(row, 23),
                                productServiceSystemBillElectricUNCAuto: this.fileHelperService.getCellValue(row, 24),
                                productServiceSystemExcludeBillElectricUNCAuto: this.fileHelperService.getCellValue(row, 25),
                                productServiceSystemTotalProductUse: this.fileHelperService.getCellValue(row, 26),
                            }
                            const customerInfo: ICustomerCreate = await this.customerService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 2)
                            });
                            if (customerInfo) {
                                await this.customerService.updateOneByInfoProductServiceSystem(customerInfo.cif, infoCustomer)
                                return;
                            }
                            return await this.customerService.create(infoCustomer);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    })])
                    break;
                case SheetName.InfoCreditInternationalCard:
                    const worksheetInfoCreditInternationalCard = content.getWorksheet(1);
                    const rowStartInfoCreditInternationalCard = 2
                    const numberOfRowsInfoCreditInternationalCard = worksheetInfoCreditInternationalCard.rowCount - 1;
                    const rowsInfoCreditInternationalCard = worksheetInfoCreditInternationalCard.getRows(rowStartInfoCreditInternationalCard, numberOfRowsInfoCreditInternationalCard) ?? [];

                    await Promise.all([rowsInfoCreditInternationalCard.map(async row => {
                        const fullName = this.fileHelperService.getCellFormulaValue(row, 2) ? this.fileHelperService.getCellFormulaValue(row, 2) : this.fileHelperService.getCellValue(row, 2);
                        const department = this.fileHelperService.getCellFormulaValue(row, 3) ? this.fileHelperService.getCellFormulaValue(row, 3) : this.fileHelperService.getCellValue(row, 3);
                        try {
                            const infoCard: ICardCreate = {
                                user: user._id,
                                typeCard: TYPE_CARD.CreditInternationalCard,
                                cif: this.fileHelperService.getCellFormulaValue(row, 1) ? this.fileHelperService.getCellFormulaValue(row, 1) : this.fileHelperService.getCellValue(row, 1),
                                fullName,
                                department,
                                typeCreditCard: this.fileHelperService.getCellFormulaValue(row, 4) ? this.fileHelperService.getCellFormulaValue(row, 4) : this.fileHelperService.getCellValue(row, 4),
                                accountNumberCreditCard: this.fileHelperService.getCellValue(row, 5),
                                accountIdCreditCard: this.fileHelperService.getCellValue(row, 6),
                                accountCreditCardLink: this.fileHelperService.getCellValue(row, 7),
                                limitAmountCreditCard: this.fileHelperService.getCellValue(row, 8),
                                codeAM: this.fileHelperService.getCellFormulaValue(row, 9) ? this.fileHelperService.getCellFormulaValue(row, 9) : this.fileHelperService.getCellValue(row, 9),
                                statusCreditCard: this.fileHelperService.getCellValue(row, 10),
                                rateDebtAutoCreditCard: this.fileHelperService.getCellValue(row, 11),
                                activeDateCreditCard: this.fileHelperService.getCellFormulaValue(row, 12) ? new Date(this.fileHelperService.getCellFormulaValue(row, 12)) :
                                    this.fileHelperService.getCellValue(row, 12) ? new Date(this.fileHelperService.getCellValue(row, 12)) : null,
                                activeDateAgainCreditCard: this.fileHelperService.getCellFormulaValue(row, 13) ? new Date(this.fileHelperService.getCellFormulaValue(row, 13)) :
                                    this.fileHelperService.getCellValue(row, 13) ? new Date(this.fileHelperService.getCellValue(row, 13)) : null,
                                expiredDateCreditCard: this.fileHelperService.getCellValue(row, 14) ? new Date(this.fileHelperService.getCellValue(row, 14)) : null,
                                closedDateCreditCard: this.fileHelperService.getCellValue(row, 15) ? new Date(this.fileHelperService.getCellValue(row, 15)) : null,
                                activeDateFirstTimeCreditCard: this.fileHelperService.getCellValue(row, 16) ? new Date(this.fileHelperService.getCellValue(row, 16)) : null,
                                statusChangeDateCreditCard: this.fileHelperService.getCellValue(row, 17) ? new Date(this.fileHelperService.getCellValue(row, 17)) : null,
                                formIssueCreditCard: this.fileHelperService.getCellValue(row, 18),
                                transactionAmountCreditCard: this.fileHelperService.getCellValue(row, 19),
                                transactionAmountWriteCreditCard: this.fileHelperService.getCellValue(row, 20),
                                transactionAmountDebtCreditCard: this.fileHelperService.getCellValue(row, 21),
                                amountFeeCreditCard: this.fileHelperService.getCellValue(row, 22),
                                amountFeeServiceCreditCard: this.fileHelperService.getCellValue(row, 23),
                                feeServiceCreditCard: this.fileHelperService.getCellValue(row, 24),
                                numberOfTransactionsCreditCard: this.fileHelperService.getCellValue(row, 25),
                                numberOfTransactionsWriteCreditCard: this.fileHelperService.getCellValue(row, 26),
                                numberOfTransactionsDebtCreditCard: this.fileHelperService.getCellValue(row, 27)

                            }
                            const info: ICardCreate = await this.cardService.findOne({
                                cif: this.fileHelperService.getCellValue(row, 1),
                                typeCard: TYPE_CARD.CreditInternationalCard,
                                fullName,
                                accountNumberCreditCard: this.fileHelperService.getCellValue(row, 5),
                                department
                            });
                            if (info) {
                                await this.cardService.updateOneByInfoCreditInternationalCard(info.cif, info)
                                return;
                            }
                            return await this.cardService.create(infoCard);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    })
                    ])
                    break;
                case SheetName.InfoRelevantCustomer:
                    const worksheetInfoRelevantCustomer = content.getWorksheet(1);
                    const rowStartInfoRelevantCustomer = 2
                    const numberOfRowsInfoRelevantCustomer = worksheetInfoRelevantCustomer.rowCount - 1;
                    const rowsInfoRelevantCustomer = worksheetInfoRelevantCustomer.getRows(rowStartInfoRelevantCustomer, numberOfRowsInfoRelevantCustomer) ?? [];

                    rowsInfoRelevantCustomer.map(async row => {
                        try {
                            if (!this.fileHelperService.getCellValue(row, 1)) return;
                            const infoParents: IParentCreate = {
                                user: user._id,
                                cif: this.fileHelperService.getCellFormulaValue(row, 1) ? this.fileHelperService.getCellFormulaValue(row, 1) : this.fileHelperService.getCellValue(row, 1),
                                fullNameRelevant: this.fileHelperService.getCellFormulaValue(row, 2) ? this.fileHelperService.getCellFormulaValue(row, 2) : this.fileHelperService.getCellValue(row, 2),
                                cifRelevant: this.fileHelperService.getCellFormulaValue(row, 3) ? this.fileHelperService.getCellFormulaValue(row, 3) : this.fileHelperService.getCellValue(row, 3),
                                relationship: this.fileHelperService.getCellFormulaValue(row, 4) ? this.fileHelperService.getCellFormulaValue(row, 4) : this.fileHelperService.getCellValue(row, 4)
                            }
                            return await this.parentService.create(infoParents);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    });
                    break;

                case SheetName.InfoRelevantCompany:
                    const worksheetInfoRelevantCompany = content.getWorksheet(1);
                    const rowStartInfoRelevantCompany = 2
                    const numberOfRowsInfoRelevantCompany = worksheetInfoRelevantCompany.rowCount - 1;
                    const rowsInfoRelevantCompany = worksheetInfoRelevantCompany.getRows(rowStartInfoRelevantCompany, numberOfRowsInfoRelevantCompany) ?? [];

                    rowsInfoRelevantCompany.map(async row => {
                        try {
                            if (!this.fileHelperService.getCellValue(row, 1)) return;
                            const infoCompany: ICompanyCreate = {
                                cif: this.fileHelperService.getCellFormulaValue(row, 1) ? this.fileHelperService.getCellFormulaValue(row, 1) : this.fileHelperService.getCellValue(row, 1),
                                nameCompany: this.fileHelperService.getCellFormulaValue(row, 2) ? this.fileHelperService.getCellFormulaValue(row, 2) : this.fileHelperService.getCellValue(row, 2),
                                cifCompany: this.fileHelperService.getCellFormulaValue(row, 3) ? this.fileHelperService.getCellFormulaValue(row, 3) : this.fileHelperService.getCellValue(row, 3),
                                position: this.fileHelperService.getCellFormulaValue(row, 4) ? this.fileHelperService.getCellFormulaValue(row, 4) : this.fileHelperService.getCellValue(row, 4),
                                relationshipOtherCompany: this.fileHelperService.getCellFormulaValue(row, 5) ? this.fileHelperService.getCellFormulaValue(row, 5) : this.fileHelperService.getCellValue(row, 5)
                            }
                            return await this.companyService.create(infoCompany);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    });
                    break;
                case SheetName.InfoWorkWithCustomer:
                    const worksheetInfoWorkWithCustomer = content.getWorksheet(1);
                    const rowStartInfoWorkWithCustomer = 2
                    const numberOfRowsInfoWorkWithCustomer = worksheetInfoWorkWithCustomer.rowCount - 1;
                    const rowsInfoWorkWithCustomer = worksheetInfoWorkWithCustomer.getRows(rowStartInfoWorkWithCustomer, numberOfRowsInfoWorkWithCustomer) ?? [];
                    rowsInfoWorkWithCustomer.map(async row => {
                        try {
                            if (!this.fileHelperService.getCellValue(row, 1)) return;
                            const info: IWorkCustomerCreate = {
                                user: user._id,
                                cif: this.fileHelperService.getCellFormulaValue(row, 1) ? this.fileHelperService.getCellFormulaValue(row, 1) : this.fileHelperService.getCellValue(row, 1),
                                workHandle: this.fileHelperService.getCellFormulaValue(row, 2) ? this.fileHelperService.getCellFormulaValue(row, 2) : this.fileHelperService.getCellValue(row, 2),
                                dateStart: this.fileHelperService.getCellValueCommon(row, 3) ? new Date(this.fileHelperService.getCellValueCommon(row, 3)) : null,
                                deadline: this.fileHelperService.getCellValueCommon(row, 4) ? new Date(this.fileHelperService.getCellValueCommon(row, 4)) : null,
                                inProgress: this.fileHelperService.getCellFormulaValue(row, 5) ? this.fileHelperService.getCellFormulaValue(row, 5) : this.fileHelperService.getCellValue(row, 5),
                                result: this.fileHelperService.getCellFormulaValue(row, 6) ? this.fileHelperService.getCellFormulaValue(row, 6) : this.fileHelperService.getCellValue(row, 6),
                                statusFix: this.fileHelperService.getCellFormulaValue(row, 7) ? this.fileHelperService.getCellFormulaValue(row, 7) : this.fileHelperService.getCellValue(row, 7)
                            }
                            return await this.workCustomerService.createOrUpdate(info);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    });
                    break;
                case SheetName.InfoOtherCustomer:
                    const worksheetInfoOtherCustomer = content.getWorksheet(1);
                    const rowStartInfoOtherCustomer = 2
                    const numberOfRowsInfoOtherCustomer = worksheetInfoOtherCustomer.rowCount - 1;
                    const rowsInfoOtherCustomer = worksheetInfoOtherCustomer.getRows(rowStartInfoOtherCustomer, numberOfRowsInfoOtherCustomer) ?? [];
                    rowsInfoOtherCustomer.map(async row => {
                        try {
                            if (!this.fileHelperService.getCellValue(row, 1)) return;
                            const info: IOtherInfoCustomerCreate = {
                                cif: this.fileHelperService.getCellFormulaValue(row, 1) ? this.fileHelperService.getCellFormulaValue(row, 1) : this.fileHelperService.getCellValue(row, 1),
                                dateKHCCAdditional: this.fileHelperService.getCellValueCommon(row, 2) ? new Date(this.fileHelperService.getCellValueCommon(row, 2)) : null,
                                productsApply: this.fileHelperService.getCellFormulaValue(row, 3) ? this.fileHelperService.getCellFormulaValue(row, 3) : this.fileHelperService.getCellValue(row, 3),
                                programsApplied: this.fileHelperService.getCellFormulaValue(row, 4) ? this.fileHelperService.getCellFormulaValue(row, 4) : this.fileHelperService.getCellValue(row, 4),
                                priorityKHRegistered: this.fileHelperService.getCellFormulaValue(row, 5) ? this.fileHelperService.getCellFormulaValue(row, 5) : this.fileHelperService.getCellValue(row, 5),
                                expensesPayed: this.fileHelperService.getCellFormulaValue(row, 6) ? this.fileHelperService.getCellFormulaValue(row, 6) : this.fileHelperService.getCellValue(row, 6),
                                habitsCustomer: this.fileHelperService.getCellFormulaValue(row, 7) ? this.fileHelperService.getCellFormulaValue(row, 7) : this.fileHelperService.getCellValue(row, 7),
                                favouriteCustomer: this.fileHelperService.getCellFormulaValue(row, 8) ? this.fileHelperService.getCellFormulaValue(row, 8) : this.fileHelperService.getCellValue(row, 8)
                            }
                            return await this.otherInfoService.create(info);
                        } catch (error) {
                            throw new InternalServerErrorException({
                                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                                message: 'http.serverError.internalServerError',
                            });
                        }

                    });
                    break;
            }
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
        return;
    }


    @ResponseCustom('customer.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(CustomerController.name, 'customer-get-info')
    @Get('/info')
    async getCustomerInfo(
        @GetUser() user: IUserDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const customerInfo: CustomerDocument = await this.customerService.findOne({cif});
        if (!customerInfo) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'customerInfo.error.notFound',
            });
        }
        if (user?.role?.name === 'admin') {
            return customerInfo;
        }
        try {
            const incomeInfo: IncomeDocument[] = await this.handleRole(user, user?.role?.name);
            const filterUserByIncome = incomeInfo.filter(v => v.cif === customerInfo.cif);
            return filterUserByIncome.length > 0 ? customerInfo : [];
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }
}
