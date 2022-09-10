import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Post,
    Put,
} from '@nestjs/common';
import {ENUM_PERMISSIONS,} from 'src/permission/permission.constant';
import {AuthAdminJwtGuard} from 'src/auth/auth.decorator';
import {Response, ResponsePaging,} from 'src/utils/response/response.decorator';
import {IResponse,} from 'src/utils/response/response.interface';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {RequestParamGuard} from 'src/utils/request/request.decorator';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {CodeDepartmentLevelSixService} from "../service/codeDepartmentLevelSix.service";
import {ENUM_ROLE_STATUS_CODE_ERROR} from "../codeDepartmentLevelSix.constant";
import {CodeDepartmentLevelSixCreateDto} from "../dto/codeDepartmentLevelSix.create.dto";
import {CodeDepartmentLevelSixRequestDto} from "../dto/codeDepartmentLevelSix.request.dto";
import {CodeDepartmentLevelSixUpdateDto} from "../dto/codeDepartmentLevelSix.update.dto";
import {ICodeDepartmentLevelSix} from "../codeDepartmentLevelSix.interface";
import {CodeDepartmentLevelSixDocument} from "../schema/codeDepartmentLevelSix.schema";
import {GetCodeLevelSix} from "../codeDepartmentLevelSix.decorator";

@Controller({
    version: '1',
    path: 'codeLevelSix',
})
export class CodeDepartmentLevelSixAdminController {
    constructor(
        private readonly codeLevelSixService: CodeDepartmentLevelSixService,
    ) {}

    @ResponsePaging('codeDepartmentLevelSix.list')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ)
    @ErrorMeta(CodeDepartmentLevelSixAdminController.name, 'list')
    @Get('/list')
    async list(): Promise<IResponse> {
        return await this.codeLevelSixService.findAll()
    }

    @Response('codeDepartmentLevelSix.create')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_CREATE)
    @ErrorMeta(CodeDepartmentLevelSixAdminController.name, 'create')
    @Post('/create')
    async create(
        @Body()
        { name, code }: CodeDepartmentLevelSixCreateDto
    ): Promise<IResponse> {
        const exist: boolean = await this.codeLevelSixService.exists(code);
        if (exist) {
            throw new BadRequestException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
                message: 'codeDepartmentLevelSix.error.exist',
            });
        }

        try {
            const create = await this.codeLevelSixService.create({
                name,
                code,
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

    @Response('codeDepartmentLevelSix.update')
    @RequestParamGuard(CodeDepartmentLevelSixRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_UPDATE)
    @ErrorMeta(CodeDepartmentLevelSixAdminController.name, 'update')
    @Put('/update/:code')
    async update(
        @GetCodeLevelSix() codeLevelSix: CodeDepartmentLevelSixDocument,
        @Body()
        { name, code }: CodeDepartmentLevelSixUpdateDto
    ): Promise<IResponse> {
        const check: boolean = await this.codeLevelSixService.exists(code, codeLevelSix._id);
        if (check) {
            throw new BadRequestException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
                message: 'codeDepartmentLevelSix.error.exist',
            });
        }

        try {
            await this.codeLevelSixService.update(codeLevelSix._id, {
                name,
                code,
            });
        } catch (e) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return {
            _id: codeLevelSix._id,
        };
    }

    @Response('codeDepartmentLevelSix.delete')
    @RequestParamGuard(CodeDepartmentLevelSixRequestDto)
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_DELETE)
    @ErrorMeta(CodeDepartmentLevelSixAdminController.name, 'delete')
    @Delete('/delete/:code')
    async delete(@GetCodeLevelSix() codeDepartmentLevelSix: ICodeDepartmentLevelSix): Promise<void> {
        try {
            await this.codeLevelSixService.deleteOneById(codeDepartmentLevelSix.code);
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
        return;
    }
}
