import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {CardService} from "../service/card.service";
import {ICardDocument} from "../card.interface";

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly incomeService: CardService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { user } = params;

        const check: ICardDocument =
            await this.incomeService.findOneById<ICardDocument>(user, {
                populate: {
                    role: true,
                    permission: true,
                },
            });
        request.__user = check;

        return true;
    }
}
