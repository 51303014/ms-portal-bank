import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { HistoryCustomerService } from '../service/historyCustomer.service';
import { IHistoryCustomerDocument } from '../historyCustomer.interface';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly historyCustomerService: HistoryCustomerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { user } = params;

        const check: IHistoryCustomerDocument =
            await this.historyCustomerService.findOneById<IHistoryCustomerDocument>(user, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
        request.__user = check;

        return true;
    }
}
