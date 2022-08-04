import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException, NotFoundException,
    Query
} from '@nestjs/common';
import {AuthPublicJwtGuard} from 'src/auth/auth.decorator';
import {ENUM_STATUS_CODE_ERROR} from 'src/utils/error/error.constant';
import {ErrorMeta} from 'src/utils/error/error.decorator';
import {Response} from 'src/utils/response/response.decorator';
import {CardService} from "../service/card.service";
import {GetUser, UserProfileGuard} from "../card.decorator";
import {ICardCreate, ICardDocument} from "../card.interface";
import {TYPE_CARD} from "../card.constant";
import {ENUM_USER_STATUS_CODE_ERROR} from "../../customers/customer.constant";
import {IResponsePaging} from "../../utils/response/response.interface";
import {PaginationService} from "../../pagination/service/pagination.service";
import {CardListSerialization} from "../serialization/card.list.serialization";
import {CardDocument} from "../schema/card.schema";

@Controller({
    version: '1',
    path: 'card',
})
export class CardController {
    constructor(
        private readonly cardService: CardService,
        private readonly paginationService: PaginationService,
    ) {
    }

    @Response('card.get.cif')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(CardController.name, 'card-get-info')
    @Get('/')
    async getCustomerInfo(
        @GetUser() user: ICardDocument,
        @Query()
            {
                cif,
                typeCard
            }
    ): Promise<any> {
        const cardInfoModel: ICardCreate[] = await this.cardService.findAll({cif, typeCard});
        if (!cardInfoModel.length) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'cardInfo.error.notFound',
            });
        }
        if (cardInfoModel) {
            try {
                switch (typeCard) {
                    case TYPE_CARD.CreditInternationalCard:
                        return cardInfoModel.map(cardInfo => {
                            return {
                                cif: cardInfo.cif,
                                fullName: cardInfo.fullName,
                                department: cardInfo.department,
                                codeAM: cardInfo.codeAM,
                                typeCreditCard: cardInfo.typeCreditCard,
                                accountNumberCreditCard: cardInfo.accountNumberCreditCard,
                                accountIdCreditCard: cardInfo.accountIdCreditCard,
                                accountCreditCardLink: cardInfo.accountCreditCardLink,
                                limitAmountCreditCard: cardInfo.limitAmountCreditCard,
                                statusCreditCard: cardInfo.statusCreditCard,
                                rateDebtAutoCreditCard: cardInfo.rateDebtAutoCreditCard,
                                activeDateCreditCard: cardInfo.activeDateCreditCard,
                                activeDateFirstTimeCreditCard: cardInfo.activeDateFirstTimeCreditCard,
                                activeDateAgainCreditCard: cardInfo.activeDateAgainCreditCard,
                                expiredDateCreditCard: cardInfo.expiredDateCreditCard,
                                closedDateCreditCard: cardInfo.closedDateCreditCard,
                                statusChangeDateCreditCard: cardInfo.statusChangeDateCreditCard,
                                formIssueCreditCard: cardInfo.formIssueCreditCard,
                                transactionAmountCreditCard: cardInfo.transactionAmountCreditCard,
                                transactionAmountDebtCreditCard: cardInfo.transactionAmountDebtCreditCard,
                                transactionAmountWriteCreditCard: cardInfo.transactionAmountWriteCreditCard,
                                amountFeeCreditCard: cardInfo.amountFeeCreditCard,
                                amountFeeServiceCreditCard: cardInfo.amountFeeServiceCreditCard,
                                feeServiceCreditCard: cardInfo.feeServiceCreditCard,
                                numberOfTransactionsCreditCard: cardInfo.numberOfTransactionsCreditCard,
                                numberOfTransactionsDebtCreditCard: cardInfo.numberOfTransactionsDebtCreditCard,
                                numberOfTransactionsWriteCreditCard: cardInfo.numberOfTransactionsWriteCreditCard
                            }
                        })
                    case TYPE_CARD.DebitDomesticCard:
                        return cardInfoModel.map(cardInfo => {
                            return {
                                cif: cardInfo.cif,
                                fullName: cardInfo.fullName,
                                codeAM: cardInfo.codeAM,
                                accountNumberDebitDomestic: cardInfo.accountNumberDebitDomestic,
                                cardNumberDebitDomestic: cardInfo.cardNumberDebitDomestic,
                                typeProductDebitDomestic: cardInfo.typeProductDebitDomestic,
                                typeChipDebitDomestic: cardInfo.typeChipDebitDomestic,
                                codeDebitDomestic: cardInfo.codeDebitDomestic,
                                statusDebitDomestic: cardInfo.statusDebitDomestic,
                                formPHTDebitDomestic: cardInfo.formPHTDebitDomestic,
                            }
                        })
                    case TYPE_CARD.DebitInternationalCard:
                        return cardInfoModel.map(cardInfo => {
                            return {
                                cif: cardInfo.cif,
                                fullName: cardInfo.fullName,
                                codeAM: cardInfo.codeAM,
                                cardNumberDebitInternational: cardInfo.cardNumberDebitInternational,
                                accountNumberDefaultLinkedCard: cardInfo.accountNumberDefaultLinkedCard,
                                amountFeeAnnually: cardInfo.amountFeeAnnually,
                                statusCardDebitInternational: cardInfo.statusCardDebitInternational,
                                expiredDateCardDebitInternational: cardInfo.expiredDateCardDebitInternational,
                                activeDateCardDebitInternational: cardInfo.activeDateCardDebitInternational,
                                typeCardDebitInternational: cardInfo.typeCardDebitInternational,
                                codeCardDebitInternational: cardInfo.codeCardDebitInternational,
                            }
                        })

                }
            } catch (err) {
                throw new InternalServerErrorException({
                    statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                    message: 'http.serverError.internalServerError',
                });
            }
        }
    }


    @Response('card.list')
    @UserProfileGuard()
    @AuthPublicJwtGuard()
    @HttpCode(HttpStatus.OK)
    @ErrorMeta(CardController.name, 'card-get-list')
    @Get('/list')
    async getCards(
        @GetUser() user: ICardDocument,
        @Query()
            {
                page,
                perPage,
                search,
                typeCard,
            }
    ): Promise<IResponsePaging> {
        try {
            const skip: number = await this.paginationService.skip(page, perPage);
            const find: Record<string, any> = {};
            if (search) {
                find['$or'] = [
                    {
                        cif: {
                            $regex: new RegExp(search),
                            $options: 'i',
                        },
                    },
                ];
            }

            if (typeCard) {
                find['$and'] = [
                    {
                        typeCard
                    },
                ];
            }
            const cardInfoModel: CardDocument[] = await this.cardService.findAll(find,
                {
                    skip: skip,
                    limit: perPage,
                });

            if (!cardInfoModel.length) {
                throw new NotFoundException({
                    statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                    message: 'cardInfo.error.notFound',
                });
            }
            const totalData: number = await this.cardService.getTotal(find);
            const totalPage: number = await this.paginationService.totalPage(
                totalData,
                perPage
            );
            const data: CardListSerialization[] =
                await this.cardService.serializationList(cardInfoModel);

            return {
                totalData,
                totalPage,
                currentPage: page,
                perPage,
                data,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }
}
