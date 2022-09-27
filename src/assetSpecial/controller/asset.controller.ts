import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    Query,
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {ResponseCustom} from 'src/utils/response/response.decorator';
import {IResponse} from 'src/utils/response/response.interface';
import {AssetService} from "../service/asset.service";
import {GetUser, UserProfileGuard} from "../asset.decorator";
import {IAssetCreate, IAssetDocument} from "../asset.interface";

@Controller({
    version: '1',
    path: 'assets',
})
export class AssetController {
    constructor(
        private readonly assetService: AssetService,
    ) {
    }

    @ResponseCustom('user.profile')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @ErrorMeta(AssetController.name, 'profile')
    @Get('/profile')
    async profile(@GetUser() user: IAssetDocument): Promise<IResponse> {
        return this.assetService.serializationProfile(user);
    }

    @ResponseCustom('assets.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(AssetController.name, 'assets-get-detail')
    @Get('/')
    async getAsset(
        @GetUser() user: IAssetDocument,
        @Query()
            {
                cif
            }
    ): Promise<any> {
        const asset: IAssetCreate[] = await this.assetService.findAll({cif});
        if (asset) {
            try {
                return asset
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }
}
