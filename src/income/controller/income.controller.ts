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
import {IncomeService} from "../service/income.service";
import {GetUser, UserProfileGuard} from "../income.decorator";
import {IIncomeDocument} from "../income.interface";
import {IncomeListDto} from "../dto/income.list.dto";

@Controller({
    version: '1',
    path: 'income',
})
export class IncomeController {
    constructor(
        private readonly incomeService: IncomeService,
    ) {
    }

    @Response('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(IncomeController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: IIncomeDocument): Promise<IResponse> {
        return this.incomeService.serializationProfile(user);
    }


    @Response('income.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(IncomeController.name, 'income-get-detail')
    @Get('/details')
    async getCustomerInfo(
        @GetUser() user: IIncomeDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const incomeInfo: IncomeListDto = await this.incomeService.findOne({cif});
        if (incomeInfo) {
            try {
                return incomeInfo
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }
}
