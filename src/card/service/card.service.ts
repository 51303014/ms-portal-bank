import {Injectable} from '@nestjs/common';
import {Model, Types} from 'mongoose';
import {plainToInstance} from 'class-transformer';
import {DatabaseEntity} from 'src/database/database.decorator';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {IDatabaseFindAllOptions, IDatabaseFindOneOptions,} from 'src/database/database.interface';
import {UserEntity} from "../../user/schema/user.schema";
import {CardDocument, CardEntity} from "../schema/card.schema";
import {CardUploadSerialization} from "../serialization/card.upload.serialization";
import {ICardCreate, ICardDocument} from "../card.interface";
import {CardListSerialization} from "../serialization/card.list.serialization";
import {CardGetSerialization} from "../serialization/card.get.serialization";
import {ICustomerCreate} from "../../customers/customer.interface";

@Injectable()
export class CardService {

    constructor(
        @DatabaseEntity(CardEntity.name)
        private readonly cardModel: Model<CardDocument>,
    ) {
    }

    async findAll<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        const files = this.cardModel.find(find).populate({
            path: 'user',
            model: UserEntity.name,
        });

        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            files.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            files.sort(options.sort);
        }

        return files.lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.cardModel.countDocuments(find);
    }

    async serializationProfile(
        data: ICardDocument
    ): Promise<CardUploadSerialization> {
        return plainToInstance(CardUploadSerialization, data);
    }

    async serializationList(
        data: ICardDocument[]
    ): Promise<CardListSerialization[]> {
        return plainToInstance(CardListSerialization, data);
    }

    async serializationGet(data: ICardDocument): Promise<CardGetSerialization> {
        return plainToInstance(CardGetSerialization, data);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.cardModel.findById(_id);

        if (options && options.populate && options.populate.user) {
            file.populate({
                path: 'user',
                model: UserEntity.name,
            });

            if (options.populate.permission) {
                file.populate({
                    path: 'user',
                    model: UserEntity.name,
                    populate: {
                        path: 'permissions',
                        model: PermissionEntity.name,
                    },
                });
            }
        }

        return file.lean();
    }

    async findOne<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.cardModel.findOne(find);

        if (options && options.populate && options.populate.user) {
            file.populate({
                path: 'user',
                model: UserEntity.name,
            });

            if (options.populate.permission) {
                file.populate({
                    path: 'user',
                    model: UserEntity.name,
                    populate: {
                        path: 'permissions',
                        model: PermissionEntity.name,
                    },
                });
            }
        }

        return file.lean();
    }

    async create({
                     cif,
                     codeAM,
                     fullName,
                     user,
                     formPHTDebitDomestic,
                     statusDebitDomestic,
                     codeDebitDomestic,
                     typeChipDebitDomestic,
                     typeProductDebitDomestic,
                     accountNumberDebitDomestic,
                     cardNumberDebitDomestic,
                     cardNumberDebitInternational,
                     accountNumberDefaultLinkedCard,
                     amountFeeAnnually,
                     statusCardDebitInternational,
                     expiredDateCardDebitInternational,
                     activeDateCardDebitInternational,
                     typeCardDebitInternational,
                     codeCardDebitInternational,
                     department,
                     typeCreditCard,
                     accountNumberCreditCard,
                     accountIdCreditCard,
                     accountCreditCardLink,
                     limitAmountCreditCard,
                     statusCreditCard,
                     rateDebtAutoCreditCard,
                     activeDateCreditCard,
                     activeDateFirstTimeCreditCard,
                     activeDateAgainCreditCard,
                     expiredDateCreditCard,
                     closedDateCreditCard,
                     statusChangeDateCreditCard,
                     formIssueCreditCard,
                     transactionAmountCreditCard,
                     transactionAmountDebtCreditCard,
                     transactionAmountWriteCreditCard,
                     amountFeeCreditCard,
                     amountFeeServiceCreditCard,
                     feeServiceCreditCard,
                     numberOfTransactionsCreditCard,
                     numberOfTransactionsDebtCreditCard,
                     numberOfTransactionsWriteCreditCard,
                    typeCard
                 }: ICardCreate
    ):
        Promise<CardDocument> {
        const cardEntity: CardEntity = {
            cif,
            fullName,
            codeAM,
            formPHTDebitDomestic,
            accountNumberDebitDomestic,
            cardNumberDebitDomestic,
            typeChipDebitDomestic,
            typeProductDebitDomestic,
            codeDebitDomestic,
            statusDebitDomestic,
            cardNumberDebitInternational,
            accountNumberDefaultLinkedCard,
            amountFeeAnnually,
            statusCardDebitInternational,
            expiredDateCardDebitInternational,
            activeDateCardDebitInternational,
            typeCardDebitInternational,
            codeCardDebitInternational,
            department,
            typeCreditCard,
            accountNumberCreditCard,
            accountIdCreditCard,
            accountCreditCardLink,
            limitAmountCreditCard,
            statusCreditCard,
            rateDebtAutoCreditCard,
            activeDateCreditCard,
            activeDateFirstTimeCreditCard,
            activeDateAgainCreditCard,
            expiredDateCreditCard,
            closedDateCreditCard,
            statusChangeDateCreditCard,
            formIssueCreditCard,
            transactionAmountCreditCard,
            transactionAmountDebtCreditCard,
            transactionAmountWriteCreditCard,
            amountFeeCreditCard,
            amountFeeServiceCreditCard,
            feeServiceCreditCard,
            numberOfTransactionsCreditCard,
            numberOfTransactionsDebtCreditCard,
            numberOfTransactionsWriteCreditCard,
            typeCard,
            user: new Types.ObjectId(user)
        };
        const create: CardDocument = new this.cardModel(cardEntity);
        return create.save();
    }

    async deleteOneById(_id: string):
        Promise<CardDocument> {
        return this.cardModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>
    ):
        Promise<CardDocument> {
        return this.cardModel.findOneAndDelete(find);
    }
    async updateOneByInfoDebitDomesticCard(
        id: string,
        {
            fullName,
            accountNumberDebitDomestic,
            cardNumberDebitDomestic,
            typeProductDebitDomestic,
            typeChipDebitDomestic,
            codeAM,
            codeDebitDomestic,
            statusDebitDomestic,
            formPHTDebitDomestic
        }: ICustomerCreate
    ): Promise<CardDocument> {
        const cardModel: CardDocument = await this.cardModel.findOne({cif: id});
        cardModel.cif = id;
        cardModel.fullName = fullName;
        cardModel.accountNumberDebitDomestic = accountNumberDebitDomestic;
        cardModel.cardNumberDebitDomestic = cardNumberDebitDomestic;
        cardModel.typeProductDebitDomestic = typeProductDebitDomestic;
        cardModel.typeChipDebitDomestic = typeChipDebitDomestic;
        cardModel.codeDebitDomestic = codeDebitDomestic;
        cardModel.statusDebitDomestic = statusDebitDomestic;
        cardModel.formPHTDebitDomestic = formPHTDebitDomestic;
        cardModel.codeAM = codeAM;
        return cardModel.save();
    }

    async updateOneByInfoCreditInternationalCard(
        id: string,
        {
            department,
            fullName,
            codeAM,
            typeCreditCard,
            accountNumberCreditCard,
            accountIdCreditCard,
            accountCreditCardLink,
            limitAmountCreditCard,
            statusCreditCard,
            rateDebtAutoCreditCard,
            activeDateCreditCard,
            activeDateFirstTimeCreditCard,
            activeDateAgainCreditCard,
            expiredDateCreditCard,
            closedDateCreditCard,
            statusChangeDateCreditCard,
            formIssueCreditCard,
            transactionAmountCreditCard,
            transactionAmountDebtCreditCard,
            transactionAmountWriteCreditCard,
            amountFeeCreditCard,
            amountFeeServiceCreditCard,
            feeServiceCreditCard,
            numberOfTransactionsCreditCard,
            numberOfTransactionsDebtCreditCard,
            numberOfTransactionsWriteCreditCard
        }: ICustomerCreate
    ): Promise<CardDocument> {
        const cardModel: CardDocument = await this.cardModel.findOne({cif: id});
        cardModel.cif = id;
        cardModel.fullName = fullName;
        cardModel.codeAM = codeAM;
        cardModel.department = department;
        cardModel.typeCreditCard = typeCreditCard;
        cardModel.accountNumberCreditCard = accountNumberCreditCard;
        cardModel.accountIdCreditCard = accountIdCreditCard;
        cardModel.accountCreditCardLink = accountCreditCardLink;
        cardModel.limitAmountCreditCard = limitAmountCreditCard;
        cardModel.rateDebtAutoCreditCard = rateDebtAutoCreditCard;
        cardModel.activeDateCreditCard = activeDateCreditCard;
        cardModel.activeDateFirstTimeCreditCard = activeDateFirstTimeCreditCard;
        cardModel.activeDateAgainCreditCard = activeDateAgainCreditCard;
        cardModel.expiredDateCreditCard = expiredDateCreditCard;
        cardModel.closedDateCreditCard = closedDateCreditCard;
        cardModel.statusChangeDateCreditCard = statusChangeDateCreditCard;
        cardModel.formIssueCreditCard = formIssueCreditCard;
        cardModel.statusCreditCard = statusCreditCard;
        cardModel.transactionAmountCreditCard = transactionAmountCreditCard;
        cardModel.transactionAmountDebtCreditCard = transactionAmountDebtCreditCard;
        cardModel.transactionAmountWriteCreditCard = transactionAmountWriteCreditCard;
        cardModel.amountFeeCreditCard = amountFeeCreditCard;
        cardModel.amountFeeServiceCreditCard = amountFeeServiceCreditCard;
        cardModel.feeServiceCreditCard = feeServiceCreditCard;
        cardModel.numberOfTransactionsCreditCard = numberOfTransactionsCreditCard;
        cardModel.numberOfTransactionsDebtCreditCard = numberOfTransactionsDebtCreditCard;
        cardModel.numberOfTransactionsWriteCreditCard = numberOfTransactionsWriteCreditCard;
        return cardModel.save();
    }

    async updateOneByInfoDebitInternationalCard(
        id: string,
        {
            fullName,
            cardNumberDebitInternational,
            accountNumberDefaultLinkedCard,
            amountFeeAnnually,
            statusCardDebitInternational,
            expiredDateCardDebitInternational,
            activeDateCardDebitInternational,
            typeCardDebitInternational,
            codeCardDebitInternational,
            codeAM
        }: ICustomerCreate
    ): Promise<CardDocument> {
        const cardModel: CardDocument = await this.cardModel.findOne({cif: id});
        cardModel.cif = id;
        cardModel.fullName = fullName;
        cardModel.cardNumberDebitInternational = cardNumberDebitInternational;
        cardModel.accountNumberDefaultLinkedCard = accountNumberDefaultLinkedCard;
        cardModel.amountFeeAnnually = amountFeeAnnually;
        cardModel.statusCardDebitInternational = statusCardDebitInternational;
        cardModel.expiredDateCardDebitInternational = expiredDateCardDebitInternational;
        cardModel.activeDateCardDebitInternational = activeDateCardDebitInternational;
        cardModel.typeCardDebitInternational = typeCardDebitInternational;
        cardModel.codeCardDebitInternational = codeCardDebitInternational;
        cardModel.codeAM = codeAM;
        return cardModel.save();
    }


}
