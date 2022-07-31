import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {ICompanyDocument} from "../company.interface";
import {CompanyService} from "../service/company.service";

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly companyService: CompanyService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { user } = params;

        const check: ICompanyDocument =
            await this.companyService.findOneById<ICompanyDocument>(user, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
        request.__user = check;

        return true;
    }
}
