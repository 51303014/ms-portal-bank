import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {FileService} from "../service/file.service";
import {IFileDocument} from "../file.interface";

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly fileService: FileService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { user } = params;

        const check: IFileDocument =
            await this.fileService.findOneById<IFileDocument>(user, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
        request.__user = check;

        return true;
    }
}
