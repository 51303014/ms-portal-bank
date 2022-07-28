import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import {UserEntity} from "../../user/schema/user.schema";

@Schema({timestamps: true, versionKey: false})
export class IncomeEntity {
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
        index: true
    })
    codeDepartmentLevelSix?: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    user: Types.ObjectId;

    @Prop({
        required: false,
        trim: true,
    })
    kindOfMoney?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEnd?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndExchange?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndExchangeLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKH?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKHLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKHExchange?: string;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndKKHExchangeLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKH?: string;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKHLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKHExchange?: string;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAtTheEndCKHExchangeLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvg?: string;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvgLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvgExchange?: string;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalAvgExchangeLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvg?: string;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvgLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvgExchange?: string;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalKKHAvgExchangeLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvg?: string;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvgLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvgExchange?: string;
    @Prop({
        required: false,
        trim: true,
    })
    raisingCapitalCKHAvgExchangeLastYear?: string;


    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEnd?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEndLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEndExchange?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAtTheEndExchangeLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEnd?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEndLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEndExchange?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAtTheEndExchangeLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEnd?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEndLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEndExchange?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditAvgAtTheEndExchangeLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEnd?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEndLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEndExchange?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtCreditTDHAvgAtTheEndExchangeLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndEndCard?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndEndCardLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndAvgCard?: string;
    @Prop({
        required: false,
        trim: true,
    })
    amountDebtLoanGTCGAndAvgCardLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFTPBaseMore?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFTPBaseMoreLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromInterestFTPBaseMore?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromInterestFTPBaseMoreLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeGuaranteeActivities?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeGuaranteeActivitiesLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeHDVFTPBaseMore?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeHDVFTPBaseMoreLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherInterest?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherInterestLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterest?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterestLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromService?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromServiceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCreditFTPBaseMore?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCreditFTPBaseMoreLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromToolFinance?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromToolFinanceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBuyStock?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeBuyStockLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBuySharesAndContribution?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeBuySharesAndContributionLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeGolden?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeGoldenLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeInterestKDNTPS?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeInterestKDNTPSLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterestKDNTPS?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeExcludeInterestKDNTPSLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherActivity?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeOtherActivityLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromDebt?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromDebtLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCardAndInterestService?: string;
    @Prop({
        required: false,
        trim: true,
    })
    incomeFromCardAndInterestServiceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    fullName?: string;
}

export const IncomeDatabaseName = 'incomes';
export const IncomeSchema = SchemaFactory.createForClass(IncomeEntity);

export type IncomeDocument = IncomeEntity & Document;

// Hooks
IncomeSchema.pre<IncomeDocument>('save', function (next) {
    next();
});
