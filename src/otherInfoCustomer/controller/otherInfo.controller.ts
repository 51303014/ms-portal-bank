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
import {GetUser, UserProfileGuard} from "../../user/user.decorator";
import {OtherInfoService} from "../service/otherInfo.service";
import {IOtherInfoCustomerCreate, IOtherInfoCustomerDocument} from "../otherInfo.interface";

@Controller({
    version: '1',
    path: 'otherInfo',
})
export class OtherInfoController {
    constructor(
        private readonly otherInfoCustomerService: OtherInfoService,
    ) {
    }

    @Response('otherInfo.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(OtherInfoController.name, 'otherInfo-get-detail')
    @Get('/')
    async getInfo(
        @GetUser() user: IOtherInfoCustomerDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const otherInfo: IOtherInfoCustomerCreate[] = await this.otherInfoCustomerService.findAll({cif});
        if (otherInfo) {
            try {
                return otherInfo
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }
}
