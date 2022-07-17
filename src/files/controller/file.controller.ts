import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post, Query,
    UploadedFile,
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {IAwsS3Response} from 'src/aws/aws.interface';
import {AwsS3Service} from 'src/aws/service/aws.s3.service';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {ENUM_FILE_TYPE} from 'src/utils/file/file.constant';
import {UploadFileSingle} from 'src/utils/file/file.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {IResponse} from 'src/utils/response/response.interface';
import {FileService} from '../service/file.service';
import {GetUser, UserProfileGuard} from '../file.decorator';
import {IFileCreate, IFileDocument, TypeFile} from "../file.interface";
import * as XLSX from 'xlsx';
import {FileCreateDto} from "../dto/file.create.dto";

@Controller({
    version: '1',
    path: 'file',
})
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly awsService: AwsS3Service
    ) {
    }

    @Response('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(FileController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: IFileDocument): Promise<IResponse> {
        return this.fileService.serializationProfile(user);
    }

    @Response('file.upload')
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


    @Response('file.download')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @UploadFileSingle('file', ENUM_FILE_TYPE.EXCEL || ENUM_FILE_TYPE.CSV)
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(FileController.name, 'download')
    @Get('/download')
    async download(
        @GetUser() user: IFileDocument
    ): Promise<any> {
        const fileInfo = await this.fileService.findAll({user: user._id});
        if (fileInfo.length > 0) {
            const workbook = XLSX.utils.book_new();
            try {
                await Promise.all(
                    fileInfo.map(async (file) => {
                        const url = await this.awsService.getBufferFromS3Promise(file.file.pathWithFilename);
                        const wb = XLSX.read(url);
                        let worksheets = {};
                        for (const sheetName of wb.SheetNames) {
                            worksheets[sheetName] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
                                header: "A",
                                blankrows: true,
                                defval: ''
                            })
                            const worksheet = XLSX.utils.json_to_sheet(worksheets[sheetName], {skipHeader: true});
                            XLSX.utils.book_append_sheet(workbook, worksheet, file.type);
                            const fileContent = XLSX.write(workbook, {
                                type: "buffer",
                                bookType: "xlsx"
                            });
                            await this.awsService.putItemInBucket(
                                `FormTongHop.xlsx`,
                                fileContent,
                            );
                        }
                    })
                )
                const url = await this.awsService.generatePreSignedUrl('FormTongHop.xlsx');
                return {url};

            } catch (err) {
                console.log(err);
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }


    @Response('file.download.single')
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
                type
            }
    ): Promise<any> {
        const fileInfo: FileCreateDto = await this.fileService.findOne({type: type});
        if (fileInfo) {
            try {
                const url = await this.awsService.generatePreSignedUrl(fileInfo.file.pathWithFilename);
                return {
                    ...fileInfo.file,
                    url
                }
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }
}
