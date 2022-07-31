import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {AssetService} from "../service/asset.service";
import {IAssetDocument} from "../asset.interface";

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly assetService: AssetService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { user } = params;

        const check: IAssetDocument =
            await this.assetService.findOneById<IAssetDocument>(user, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
        request.__user = check;

        return true;
    }
}
