import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {ParentService} from "../service/parent.service";
import {CustomerDocument} from "../../customers/schema/customer.schema";
import {IUserDocument} from "../../user/user.interface";

export interface IParentDocument extends Omit<CustomerDocument, 'user'> {
    user: IUserDocument;
}

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly parentService: ParentService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { user } = params;

        const check: IParentDocument =
            await this.parentService.findOneById<IParentDocument>(user, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
        request.__user = check;

        return true;
    }
}
