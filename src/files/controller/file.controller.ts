import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Query,
    UploadedFile,
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {IAwsS3Response} from 'src/aws/aws.interface';
import {AwsS3Service} from 'src/aws/service/aws.s3.service';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {ENUM_FILE_TYPE} from 'src/utils/file/file.constant';
import {UploadFileSingle} from 'src/utils/file/file.decorator';
import {ResponseCustom} from 'src/utils/response/response.decorator';
import {IResponse} from 'src/utils/response/response.interface';
import {FileService} from '../service/file.service';
import {GetUser, UserProfileGuard} from '../file.decorator';
import {IFileCreate, IFileDocument, TypeFile} from "../file.interface";
import * as XLSX from 'xlsx';
import {CustomerService} from "../../customers/service/customer.service";
import {CustomerDocument} from "../../customers/schema/customer.schema";

@Controller({
    version: '1',
    path: 'file',
})
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly customerService: CustomerService,
        private readonly awsService: AwsS3Service
    ) {
    }

    @ResponseCustom('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(FileController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: IFileDocument): Promise<IResponse> {
        return this.fileService.serializationProfile(user);
    }

    @ResponseCustom('file.upload')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @UploadFileSingle('file', ENUM_FILE_TYPE.EXCEL || ENUM_FILE_TYPE.CSV)
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(FileController.name, 'upload')
    @Post('/upload')
    async upload(
        @GetUser() user: IFileDocument,
        @Body() fileType: TypeFile,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<void> {
        const content: Buffer = file.buffer;
        const path = await this.fileService.createRandomFilename(file.originalname);

        try {
            const fileInfo: IFileCreate = await this.fileService.findOne({user: user._id, type: fileType.type});
            if (fileInfo) {
                await this.fileService.updateOneById(fileInfo._id, fileInfo)
                return;
            }
            const aws: IAwsS3Response = await this.awsService.putItemInBucket(
                `${path.filename}`,
                content,
                {
                    path: `${path.path}/${user._id}`,
                }
            );
            await this.fileService.create({
                fileName: `${path.filename}`,
                type: fileType.type,
                user: user._id,
                file: aws
            });
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
        return;
    }


    @ResponseCustom('file.download')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @UploadFileSingle('file', ENUM_FILE_TYPE.EXCEL || ENUM_FILE_TYPE.CSV)
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(FileController.name, 'download')
    @Get('/download')
    async download(
        @GetUser() user: IFileDocument,
    ): Promise<any> {
        const fileInfo = await this.fileService.findAll({user: user._id});
        if (fileInfo.length > 0) {
            const workbook = XLSX.utils.book_new();

            try {
                fileInfo.map(async (data) => {
                    const wb = XLSX.readFile(data.file.path);
                    let worksheets = {};
                    for (const sheetName of wb.SheetNames) {
                        worksheets[sheetName] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
                            header: "A",
                            blankrows: true,
                            defval: ''
                        })
                        const worksheet = XLSX.utils.json_to_sheet(worksheets[sheetName], {skipHeader: true});
                        XLSX.utils.book_append_sheet(workbook, worksheet, data.type);

                    }
                })

                return XLSX.write(workbook, {
                    type: 'base64',
                    bookType: "xlsx",
                    bookSST: false
                });
            } catch (err) {
                console.log(err);
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }

    @ResponseCustom('file.download.single')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @UploadFileSingle('file', ENUM_FILE_TYPE.EXCEL || ENUM_FILE_TYPE.CSV)
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(FileController.name, 'download-single')
    @Get('/download-single')
    async downloadSingleFile(
        @GetUser() user: IFileDocument,
        @Query()
            {
                cif
            },
    ): Promise<any> {
        const customer: CustomerDocument[] = await this.customerService.findAll({cif});
        if (customer) {
            try {
                const workbook = XLSX.utils.book_new();
                const mappingCustomer = customer.map((v) => {
                    return {
                        CIF: v.cif,
                        "Họ tên khách hàng": v.fullName,
                        "CN mở CIF": v.brandCifOpen,
                        "Ngày mở CIF": v.dateCifOpen,
                        "Quốc tịch": v.nationality,
                        "Địa chỉ": v.address,
                        "Nơi cư trú": v.residence,
                        "Ngày sinh": v.birthday,
                        "Nơi sinh": v.birthPlace,
                        "Số định danh(CMND/CCCD)": v.numberIdentity,
                        "Ngày hiệu lựcCMND/CCCD": v.effectiveDate,
                        "Tuổi": v.age,
                        "Email": v.email,
                        "SĐT": v.mobile,
                        "Giới tính": v.gender,
                        "Tình trạng hôn nhân": v.maritalStatus,
                        "Ngành nghề": v.job,
                        "Thời gian quan hệ với Ngân hàng": v.relationshipBank,
                        "Trạng thái khách hàng": v.currentStatus,
                        "Trạng thái trước đó": v.previousStatus,
                        "Ngày thay đổi trạng thái": v.statusChangeDate,
                        "Đối tượng khách hàng": v.customerType,
                        "Phân đoạn khách hàng": v.customerSegment,
                        "Phân đoạn số dư tín dụng": v.creditBalanceSegment,
                        "Phân đoạn số dư huy động": v.depositBalanceSegment,
                        "Nhóm nợ": v.debtGroup,
                        "Thu nhập thuần năm trước của khách hàng tại Chi nhánh": v.incomeBrandLastYear,
                        "Thu nhập thuần từ đầu năm của khách hàng tại Chi nhánh": v.incomeBrandYearly,
                        "Thu nhập thuần năm trước của khách hàng toàn hệ thống": v.incomeTotalLastYear,
                        "Thu nhập thuần từ đầu năm của khách hàng trên toàn hệ thống": v.incomeTotalYearly,
                        "Giới hạn tín dụng theo khách hàng (Quy đổi)": v.creditLimitCustomer,
                        "Tổng số dư tín dụng cuối năm trước (quy đổi)": v.totalCreditBalanceLastYear,
                        "Tổng số dư tín dụng cuối ngày (quy đổi)": v.totalCreditBalanceEndDay,
                        "Tổng số dư tín dụng bình quân năm trước (quy đổi)": v.totalCreditBalanceAvgLastYear,
                        "Tổng số dư tín dụng bình quân trong kỳ (quy đổi)": v.totalCreditBalanceAvgBeginYear,
                        "Dư nợ lãi cuối năm trước (quy đổi)": v.coreDebtLastYear,
                        "Dư nợ lãi cuối ngày (quy đổi)": v.coreDebt,
                        "Dư nợ cho vay cuối năm trước (quy đổi)": v.balanceDebtLastYear,
                        "Dư nợ cho vay cuối ngày (quy đổi)": v.balanceDebtEndDay,
                        "Dư nợ thẻ tín dụng cuối năm trước (quy đổi)": v.balanceCreditLastYear,
                        "Dư nợ thẻ tín dụng cuối ngày (quy đổi)": v.balanceCreditEndDay,
                        "Dư nợ thấu chi cuối năm trước (quy đổi)": v.overdraftBalanceLastYear,
                        "Dư nợ thấu chi cuối ngày (quy đổi)": v.overdraftBalanceEndDay,
                        "Tổng số dư huy động cuối năm trước (quy đổi)": v.totalDepositBalanceLastYear,
                        "Tổng số dư huy động cuối ngày (quy đổi)": v.totalDepositBalanceEndDay,
                        "Tổng số dư huy động bình quân năm trước (quy đổi)": v.totalDepositBalanceAvgLastYear,
                        "Tổng số dư huy động bình quân trong kỳ từ đầu năm (quy đổi)": v.totalDepositBalanceAvgBeginYear,
                        "Số dư tiền gửi thanh toán cuối năm trước (quy đổi)": v.paymentBalanceDepositLastYear,
                        "Số dư tiền gửi thanh toán cuối ngày (quy đổi)": v.paymentBalanceDepositEndDay,
                        "Số dư tiền gửi có kỳ hạn cuối năm trước (quy đổi)": v.termDepositBalanceLastYear,
                        "Số dư tiền gửi có kỳ hạn cuối ngày (quy đổi)": v.termDepositBalanceEndDay,
                        "Chi tiết TSĐB theo từng khoản vay": v.totalValueTSDB
                    }
                })

                const ws = XLSX.utils.json_to_sheet(mappingCustomer);

                XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');

                return XLSX.write(workbook, {
                    type: 'base64',
                    bookType: "xlsx",
                    bookSST: false
                })
            } catch (err) {
                console.log(err);
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }
}
