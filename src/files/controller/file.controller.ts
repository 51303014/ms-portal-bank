import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    UploadedFile,
} from '@nestjs/common';
import { AuthPublicJwtGuard } from 'src/auth/auth.decorator';
import { IAwsS3Response } from 'src/aws/aws.interface';
import { AwsS3Service } from 'src/aws/service/aws.s3.service';
import { ENUM_STATUS_CODE_ERROR } from 'src/utils/error/error.constant';
import { ErrorMeta } from 'src/utils/error/error.decorator';
import { ENUM_FILE_TYPE } from 'src/utils/file/file.constant';
import { UploadFileSingle } from 'src/utils/file/file.decorator';
import { Response } from 'src/utils/response/response.decorator';
import { IResponse } from 'src/utils/response/response.interface';
import {FileService} from '../service/file.service';
import {GetUser, UserProfileGuard} from '../file.decorator';
import {IFileDocument, TypeFile} from "../file.interface";
import * as XLSX from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx';
@Controller({
    version: '1',
    path: 'file',
})
export class FileController {
    constructor(
        private readonly fileService: FileService,
        private readonly awsService: AwsS3Service
    ) {}

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
        @UploadedFile() file: Express.Multer.File,
        type: TypeFile
    ): Promise<void> {
        const filename: string = file.originalname;
        const content: Buffer = file.buffer;
        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toUpperCase();
        const path = await this.fileService.createRandomFilename(file.originalname);
        const wb = XLSX.read(content);
        const sheets = wb.SheetNames;

        try {
            const aws: IAwsS3Response = await this.awsService.putItemInBucket(
                `${path.filename}.${mime}`,
                content,
                {
                    path: `${path.path}/${user._id}`,
                }
            );

            await this.fileService.create({fileName: `${path.filename}.${mime}`, type, user: user._id, awsFile: aws});
        } catch (err) {
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
    @Post('/download')
    async download(
        @GetUser() user: IFileDocument,
        type: TypeFile
    ): Promise<any> {
        const fileInfo = await this.fileService.findAll({user: user._id});
        if (fileInfo.length > 0) {
            try {
                 return await Promise.all(
                    fileInfo.map(async (file) => {
                        const url = await this.awsService.getItemInBucket(file.file.filename, file.file.pathWithFilename);
                        return {
                            ...file.file,
                            url
                        }
                    })
                )
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }
}
