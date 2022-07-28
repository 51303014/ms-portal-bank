import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {IncomeService} from "../service/income.service";
import {IIncomeDocument} from "../income.interface";

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly incomeService: IncomeService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { user } = params;

        const check: IIncomeDocument =
            await this.incomeService.findOneById<IIncomeDocument>(user, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
        request.__user = check;

        return true;
    }
}
