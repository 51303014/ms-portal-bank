import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException, NotFoundException, Post,
    Query
} from '@nestjs/common';
import {AuthAdminJwtGuard, AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {ParentService} from "../service/parent.service";
import {GetUser, UserProfileGuard} from "../parent.decorator";
import {ParentListDto} from "../dto/parent.list.dto";
import {IParentCreate} from "../parent.interface";
import {ENUM_PERMISSION_STATUS_CODE_ERROR, ENUM_PERMISSIONS} from "../../permission/permission.constant";
import {RoleCreateDto} from "../../role/dto/role.create.dto";
import {IResponse} from "../../utils/response/response.interface";
import {ENUM_ROLE_STATUS_CODE_ERROR} from "../../role/role.constant";
import {PermissionDocument} from "../../permission/schema/permission.schema";
import {ParentCreateDto} from "../dto/parent.create.dto";

class IParentDocument {
}

@Controller({
    version: '1',
    path: 'parents',
})
export class ParentController {
    constructor(
        private readonly parentService: ParentService,
    ) {
    }

    @Response('parents.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(ParentController.name, 'parents-get-detail')
    @Get('/')
    async getInfo(
        @GetUser() user: IParentDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const parentInfo: IParentCreate[] = await this.parentService.findAll({cif});
        if (parentInfo) {
            try {
                return parentInfo
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }

    @Response('parents.create')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_CREATE)
    @ErrorMeta(ParentController.name, 'create')
    @Post('/create')
    async create(
        @Body()
            bodyParents: ParentCreateDto[]
    ): Promise<IResponse> {
        // const exist: boolean = await this.parentService.exists(name);
        // if (exist) {
        //     throw new BadRequestException({
        //         statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
        //         message: 'role.error.exist',
        //     });
        // }

        // for (const permission of permissions) {
        //     const checkPermission: PermissionDocument =
        //         await this.permissionService.findOneById(permission);
        //
        //     if (!checkPermission) {
        //         throw new NotFoundException({
        //             statusCode:
        //             ENUM_PERMISSION_STATUS_CODE_ERROR.PERMISSION_NOT_FOUND_ERROR,
        //             message: 'permission.error.notFound',
        //         });
        //     }
        // }

        try {
             bodyParents.map(async info => {
                const infoParent: IParentCreate = {
                    cif: info.cif,
                    fullNameRelevant: info.fullNameRelevant,
                    cifRelevant: info.cifRelevant,
                    relationship: info.relationship
                }
                await this.parentService.create(infoParent)
            })
            return;
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }
}
