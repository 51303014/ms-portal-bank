import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Post,
    UploadedFile,
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {IResponse} from 'src/utils/response/response.interface';
import {UserService} from '../service/user.service';
import {GetUser, UserProfileGuard} from '../user.decorator';
import {IUserCreate, IUserDocument} from '../user.interface';
import {UploadFileSingle} from "../../utils/file/file.decorator";
import {ENUM_FILE_TYPE} from "../../utils/file/file.constant";
import Excel from "exceljs";
import {ENUM_STATUS_CODE_ERROR} from "../../utils/error/error.constant";
import {HelperFileService} from "../../utils/helper/service/helper.file.service";
import {RoleDocument} from "../../role/schema/role.schema";
import {RoleService} from "../../role/service/role.service";
import {ROLE_USER} from "../user.constant";

@Controller({
    version: '1',
    path: 'user',
})
export class UserPublicController {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly fileHelperService: HelperFileService
    ) {
    }

    @Response('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(UserPublicController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: IUserDocument): Promise<IResponse> {
        return this.userService.serializationProfile(user);
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
    // @UserProfileGuard()
    // @AuthPublicJwtGuard()
    @UploadFileSingle('file', ENUM_FILE_TYPE.EXCEL || ENUM_FILE_TYPE.CSV)
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(UserPublicController.name, 'upload')
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
                        if (role) {
                            bodyUser = {
                                ...bodyUser,
                                role: role._id
                            }
                        }
                        const infoUser: IUserCreate = await this.userService.findOne({
                            codeEmployee: this.fileHelperService.getCellValue(row, 2)
                        });
                        if (infoUser) {
                            await this.userService.updateOneById(infoUser.codeEmployee, bodyUser)
                            return;
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

}
