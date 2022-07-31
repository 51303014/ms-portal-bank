import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Query
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {IResponse} from 'src/utils/response/response.interface';
import {CompanyService} from "../service/company.service";
import {GetUser, UserProfileGuard} from "../company.decorator";
import {ICompanyCreate, ICompanyDocument} from "../company.interface";
import {CompanyListDto} from "../dto/company.list.dto";

@Controller({
    version: '1',
    path: 'companies',
})
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
    ) {
    }


    @Response('companies.get.cif')
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
}
