import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {OtherInfoService} from "../service/otherInfo.service";
import {CustomerDocument} from "../../customers/schema/customer.schema";
import {IUserDocument} from "../../user/user.interface";


export interface IWorkCustomerDocument extends Omit<CustomerDocument, 'user'> {
    user: IUserDocument;
}
@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly workCustomerService: OtherInfoService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { user } = params;

        const check: IWorkCustomerDocument =
            await this.workCustomerService.findOneById<IWorkCustomerDocument>(user, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
        request.__user = check;

        return true;
    }
}
