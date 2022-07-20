import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {CustomerService} from "../service/customer.service";
import {ICustomerDocument} from "../customer.interface";

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly fileService: CustomerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { user } = params;

        const check: ICustomerDocument =
            await this.fileService.findOneById<ICustomerDocument>(user, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
        request.__user = check;

        return true;
    }
}
