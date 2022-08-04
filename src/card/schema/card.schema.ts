import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import {UserEntity} from "../../user/schema/user.schema";

@Schema({timestamps: true, versionKey: false})
export class CardEntity {
    @Prop({
        required: false,
        trim: true,
        index: true
    })
    cif: string;

    @Prop({
        required: false,
        trim: true,
        index: true
    })
    codeAM?: string;

    @Prop({
        required: false,
        trim: true,
    })
    fullName?: string;

    @Prop({
        required: false,
        trim: true,
    })
    typeCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    accountNumberDebitDomestic?: string;


    @Prop({
        required: false,
        trim: true,
    })
    accountNumberDefaultLinkedCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountFeeAnnually?: string;

    @Prop({
        required: false,
        trim: true,
    })
    statusCardDebitInternational?: string;

    @Prop({
        type: Date,
        required: false
    })
    expiredDateCardDebitInternational?: Date;

    @Prop({
        type: Date,
        required: false
    })
    activeDateCardDebitInternational?: Date;

    @Prop({
        required: false,
        trim: true,
    })
    typeCardDebitInternational?: string;

    @Prop({
        required: false,
        trim: true,
    })
    codeCardDebitInternational?: string;

    @Prop({
        required: false,
        trim: true,
    })
    cardNumberDebitDomestic?: string;
    @Prop({
        required: false,
        trim: true,
    })
    cardNumberDebitInternational?: string;

    @Prop({
        required: false,
        trim: true,
    })
    typeProductDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    typeChipDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    codeDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    statusDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    formPHTDebitDomestic?: string;

    @Prop({
        required: false,
        trim: true,
    })
    department?: string;

    @Prop({
        required: false,
        trim: true,
    })
    typeCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    accountNumberCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    accountIdCreditCard?: string;
    @Prop({
        required: false,
        trim: true,
    })
    accountCreditCardLink?: string;

    @Prop({
        required: false,
        trim: true,
    })
    limitAmountCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    statusCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    rateDebtAutoCreditCard?: string;

    @Prop({
        type: Date,
        required: false
    })
    activeDateCreditCard?: Date;

    @Prop({
        type: Date,
        required: false
    })
    activeDateAgainCreditCard?: Date;

    @Prop({
        type: Date,
        required: false
    })
    expiredDateCreditCard?: Date;

    @Prop({
        type: Date,
        required: false
    })
    closedDateCreditCard?: Date;

    @Prop({
        type: Date,
        required: false
    })
    activeDateFirstTimeCreditCard?: Date;

    @Prop({
        type: Date,
        required: false
    })
    statusChangeDateCreditCard?: Date;

    @Prop({
        required: false,
        trim: true,
    })
    formIssueCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    transactionAmountCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    transactionAmountWriteCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountFeeCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountFeeServiceCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    feeServiceCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    numberOfTransactionsCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    numberOfTransactionsWriteCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    numberOfTransactionsDebtCreditCard?: string;

    @Prop({
        required: false,
        trim: true,
    })
    transactionAmountDebtCreditCard?: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    user: Types.ObjectId;
}

export const CardDatabaseName = 'cards';
export const CardSchema = SchemaFactory.createForClass(CardEntity);

export type CardDocument = CardEntity & Document;

// Hooks
CardSchema.pre<CardDocument>('save', function (next) {
    next();
});
