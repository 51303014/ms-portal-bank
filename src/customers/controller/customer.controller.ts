import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException, NotFoundException,
    Post, Query,
    UploadedFile,
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {AwsS3Service} from 'src/aws/service/aws.s3.service';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {ENUM_FILE_TYPE} from 'src/utils/file/file.constant';
import {UploadFileSingle} from 'src/utils/file/file.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {IResponse} from 'src/utils/response/response.interface';
import {CustomerService} from "../service/customer.service";
import {GetUser, UserProfileGuard} from "../customer.decorator";
import {CustomerFile, ICustomerCreate, ICustomerDocument, SheetName} from "../customer.interface";
import {CustomerCreateDto} from "../dto/customer.create.dto";
import Excel from 'exceljs';
import {HelperFileService} from "../../utils/helper/service/helper.file.service";
import {ENUM_USER_STATUS_CODE_ERROR} from "../customer.constant";

@Controller({
    version: '1',
    path: 'customer',
})
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService,
        private readonly awsService: AwsS3Service,
        private readonly fileHelperService: HelperFileService
    ) {
    }

    @Response('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(CustomerController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: ICustomerDocument): Promise<IResponse> {
        return this.customerService.serializationProfile(user);
    }

    @Response('customer.upload')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @UploadFileSingle('file', ENUM_FILE_TYPE.EXCEL || ENUM_FILE_TYPE.CSV)
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(CustomerController.name, 'upload')
    @Post('/upload')
    async upload(
        @GetUser() user: ICustomerDocument,
        @Body() customerFile: CustomerFile,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<void> {
        const workbook = new Excel.Workbook();
        const content = await workbook.xlsx.load(file.buffer);
        if (!customerFile || !customerFile.fileType) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'fileType.error.notFound',
            });
        }
        try {
            switch (customerFile.fileType) {
                case SheetName.InfoCustomerMis:
                    console.log(2222, customerFile);
                    const worksheet = content.getWorksheet(1);
                    const rowStartIndex = 3;
                    const numberOfRows = worksheet.rowCount - 2;
                    const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
                    rows.map(async row => {
                        const infoCustomer: ICustomerCreate = {
                            user: user._id,
                            cif: this.fileHelperService.getCellValue(row, 1),
                            fullName: this.fileHelperService.getCellValue(row, 2),
                            brandCifOpen: +this.fileHelperService.getCellValue(row, 3),
                            dateCifOpen: this.fileHelperService.getCellValue(row, 4) ? new Date(this.fileHelperService.getCellValue(row, 4)) : null,
                            nationality: this.fileHelperService.getCellValue(row, 5),
                            address: this.fileHelperService.getCellValue(row, 6),
                            residence: this.fileHelperService.getCellValue(row, 7),
                            birthday: this.fileHelperService.getCellValue(row, 8) ? new Date(this.fileHelperService.getCellValue(row, 8)) : null,
                            birthPlace: this.fileHelperService.getCellValue(row, 9),
                            customerId: this.fileHelperService.getCellValue(row, 10),
                            numberIdentity: this.fileHelperService.getCellValue(row, 11),
                            effectiveDate: this.fileHelperService.getCellValue(row, 12) ? new Date(this.fileHelperService.getCellValue(row, 12)) : null,
                            age: +this.fileHelperService.getCellValue(row, 13),
                            email: this.fileHelperService.getCellValue(row, 14),
                            mobile: this.fileHelperService.getCellValue(row, 15),
                            gender: this.fileHelperService.getCellValue(row, 16),
                            maritalStatus: this.fileHelperService.getCellValue(row, 17),
                            job: this.fileHelperService.getCellValue(row, 18),
                            relationshipBank: this.fileHelperService.getCellValue(row, 19),
                            currentStatus: this.fileHelperService.getCellValue(row, 20),
                            previousStatus: this.fileHelperService.getCellValue(row, 21),
                            statusChangeDate: this.fileHelperService.getCellValue(row, 22),
                            customerType: this.fileHelperService.getCellValue(row, 23),
                            customerSegment: this.fileHelperService.getCellValue(row, 24),
                            creditBalanceSegment: this.fileHelperService.getCellValue(row, 25),
                            depositBalanceSegment: this.fileHelperService.getCellValue(row, 26),
                            debtGroup: this.fileHelperService.getCellValue(row, 27),
                            incomeBrandYearly: this.fileHelperService.getCellValue(row, 28),
                            incomeTotalYearly: this.fileHelperService.getCellValue(row, 29),
                        }
                        const customerInfo: ICustomerCreate = await this.customerService.findOne({
                            cif: this.fileHelperService.getCellValue(row, 1)
                        });
                        if (customerInfo) {
                            await this.customerService.updateOneById(customerInfo.cif, infoCustomer)
                            return;
                        }
                        return await this.customerService.create(infoCustomer);
                    });
                    break;
                case SheetName.InfoCustomer:
                    const worksheetInfoCustomer = content.getWorksheet(1);
                    const rowStartIndexInfoCustomer = 3;
                    const numberOfRowsInfoCustomer = worksheetInfoCustomer.rowCount - 3;
                    const rowsInfoCustomer = worksheetInfoCustomer.getRows(rowStartIndexInfoCustomer, numberOfRowsInfoCustomer) ?? [];
                    rowsInfoCustomer.map(async row => {
                        const infoCustomer: ICustomerCreate = {
                            user: user._id,
                            creditLimitCustomer: this.fileHelperService.getCellValue(row, 2),
                            totalCreditBalanceLastYear: this.fileHelperService.getCellValue(row, 3),
                            totalCreditBalanceEndDay: this.fileHelperService.getCellValue(row, 4),
                            totalCreditBalanceAvgBeginYear: this.fileHelperService.getCellValue(row, 5),
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
                        }
                        const customerInfo: ICustomerCreate = await this.customerService.findOne({
                            cif: this.fileHelperService.getCellValue(row, 1)
                        });
                        if (customerInfo) {
                            await this.customerService.updateOneById(customerInfo.cif, infoCustomer)
                            return;
                        }
                        return await this.customerService.create(infoCustomer);
                    });
                    break;
                case SheetName.InfoCustomerMisLastYear:
                    const worksheetInfoCustomerMisLastYear = content.getWorksheet(1);
                    const rowStartInfoCustomerMisLastYear = 3;
                    const numberOfRowsInfoCustomerMisLastYear = worksheetInfoCustomerMisLastYear.rowCount - 3;
                    const rowsInfoCustomerMisLastYear = worksheetInfoCustomerMisLastYear.getRows(rowStartInfoCustomerMisLastYear, numberOfRowsInfoCustomerMisLastYear) ?? [];
                    rowsInfoCustomerMisLastYear.map(async row => {
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
                    });
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


    @Response('customer.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(CustomerController.name, 'customer-get-info')
    @Get('/info')
    async getCustomerInfo(
        @GetUser() user: ICustomerDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const customerInfo: CustomerCreateDto = await this.customerService.findOne({cif});
        if (customerInfo) {
            try {
                return customerInfo
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }
}
