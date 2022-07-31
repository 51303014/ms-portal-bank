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
import {ParentService} from "../service/parent.service";
import {GetUser, UserProfileGuard} from "../parent.decorator";
import {ParentListDto} from "../dto/parent.list.dto";
import {IParentCreate} from "../parent.interface";

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
}
