import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import {UserEntity} from "../../user/schema/user.schema";

@Schema({timestamps: true, versionKey: false})
export class CustomerEntity {
    @Prop({
        required: false,
        trim: true,
        index: true
    })
    cif: string;

    @Prop({
        required: false,
        trim: true,
    })
    fullName: string;

    @Prop({
        required: false
    })
    brandCifOpen: number;

    @Prop({
        required: false
    })
    age: number;

    @Prop({
        type: Date,
        required: false
    })
    dateCifOpen: Date;

    @Prop({
        required: false,
        default: 'VIETNAM',
        trim: true,
    })
    nationality: string;

    @Prop({
        required: false,
        trim: true,
    })
    email: string;

    @Prop({
        required: false,
        trim: true,
    })
    mobile: string;

    @Prop({
        required: false,
        trim: true,
    })
    gender: string;

    @Prop({
        default: 'UNKNOWN',
        required: false,
        trim: true,
    })
    maritalStatus: string;

    @Prop({
        required: false,
        trim: true,
    })
    job: string;

    @Prop({
        required: false,
        trim: true,
    })
    relationshipBank: string;

    @Prop({
        required: false,
        trim: true,
    })
    address: string;

    @Prop({
        required: false,
        trim: true,
    })
    residence: string;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    birthday: Date;

    @Prop({
        required: false,
        trim: true,
    })
    birthPlace: string;

    @Prop({
        required: false,
        trim: true,
    })
    customerId: string;

    @Prop({
        required: false,
        trim: true,
    })
    numberIdentity: string;

    @Prop({
        required: false,
        trim: true,
    })
    customerType: string;

    @Prop({
        required: false,
        trim: true,
    })
    customerSegment: string;

    @Prop({
        required: false,
        trim: true,
    })
    creditBalanceSegment: string;

    @Prop({
        required: false,
        trim: true,
    })
    depositBalanceSegment: string;

    @Prop({
        required: false,
        trim: true,
    })
    debtGroup: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBrandYearly: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeBrandLastYear: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeTotalYearly: string;

    @Prop({
        required: false,
        trim: true,
    })
    incomeTotalLastYear: string;

    @Prop({
        type: Date,
        required: false,
        trim: true,
    })
    effectiveDate: Date;

    @Prop({
        required: false,
        trim: true,
    })
    statusChangeDate: string;

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
    currentStatus: string;

    @Prop({
        required: false,
        trim: true,
    })
    previousStatus: string;

    @Prop({
        required: false,
        trim: true,
    })
    creditLimitCustomer?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalCreditBalanceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalCreditBalanceEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalCreditBalanceAvgBeginYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    balanceDebtLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    balanceDebtEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    balanceCreditLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    balanceCreditEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    overdraftBalanceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    overdraftBalanceEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalDepositBalanceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalDepositBalanceEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    totalDepositBalanceAvgBeginYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    paymentBalanceDepositLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    paymentBalanceDepositEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    termDepositBalanceLastYear?: string;

    @Prop({
        required: false,
        trim: true,
    })
    termDepositBalanceEndDay?: string;

    @Prop({
        required: false,
        trim: true,
    })
    fileTypeCustomer?: string;
}

export const CustomerDatabaseName = 'customers';
export const CustomerSchema = SchemaFactory.createForClass(CustomerEntity);

export type CustomerDocument = CustomerEntity & Document;

// Hooks
CustomerSchema.pre<CustomerDocument>('save', function (next) {
    if (this.address) {
        this.address = this.address.toLowerCase();
    }
    next();
});
