import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException, Post,
    Query
} from '@nestjs/common';
import {AuthAdminJwtGuard, AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {ResponseCustom} from 'src/utils/response/response.decorator';
import {CompanyService} from "../service/company.service";
import {GetUser, UserProfileGuard} from "../company.decorator";
import {ICompanyCreate, ICompanyDocument} from "../company.interface";
import {ENUM_PERMISSIONS} from "../../permission/permission.constant";
import {ParentCreateDto} from "../../parents/dto/parent.create.dto";
import {IResponse} from "../../utils/response/response.interface";
import {IParentCreate} from "../../parents/parent.interface";
import {CompanyCreateDto} from "../dto/company.create.dto";

@Controller({
    version: '1',
    path: 'companies',
})
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
    ) {
    }

    @ResponseCustom('companies.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(CompanyController.name, 'companies-get-detail')
    @Get('/')
    async getCustomerInfo(
        @GetUser() user: ICompanyDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const companyInfo: ICompanyCreate[] = await this.companyService.findAll({cif});
        if (companyInfo) {
            try {
                return companyInfo
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }

    @ResponseCustom('companies.create')
    @AuthAdminJwtGuard(ENUM_PERMISSIONS.ROLE_READ, ENUM_PERMISSIONS.ROLE_CREATE)
    @ErrorMeta(CompanyController.name, 'create')
    @Post('/create')
    async create(
        @Body()
            bodyCompanies: CompanyCreateDto[]
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
            bodyCompanies.map(async info => {
                const infoCompany: ICompanyCreate = {
                    cif: info.cif,
                    nameCompany: info.nameCompany,
                    cifCompany: info.cifCompany,
                    position: info.position,
                    relationshipOtherCompany: info.relationshipOtherCompany
                }
                await this.companyService.create(infoCompany)
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
