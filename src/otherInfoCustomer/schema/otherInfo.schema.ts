import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document} from 'mongoose';

@Schema({timestamps: true, versionKey: false})
export class OtherInfoCustomerEntity {
    @Prop({
        required: false,
        trim: true,
        index: true
    })
    cif: string;

    @Prop({
        Type: Date,
        required: false,
    })
    dateKHCCAdditional?: Date;

    @Prop({
        required: false,
        trim: true,
    })
    productsApply?: string;

    @Prop({
        required: false,
        trim: true,
    })
    programsApplied?: string;

    @Prop({
        required: false,
        trim: true,
    })
    priorityKHRegistered?: string;

    @Prop({
        required: false,
        trim: true,
    })
    expensesPayed?: string;

    @Prop({
        required: false,
        trim: true,
    })
    habitsCustomer?: string;

    @Prop({
        required: false,
        trim: true,
    })
    favouriteCustomer?: string;
}

export const OtherInfoCustomerDatabaseName = 'otherInfoCustomers';
export const OtherInfoCustomerSchema = SchemaFactory.createForClass(OtherInfoCustomerEntity);

export type OtherInfoCustomerDocument = OtherInfoCustomerEntity & Document;

// Hooks
OtherInfoCustomerSchema.pre<OtherInfoCustomerDocument>('save', function (next) {
    next();
});
