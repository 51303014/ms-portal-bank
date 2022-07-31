import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document} from 'mongoose';

@Schema({timestamps: true, versionKey: false})
export class WorkCustomerEntity {
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
    workHandle?: string;

    @Prop({
        Type: Date,
        required: false,
    })
    dateStart?: Date;

    @Prop({
        Type: Date,
        required: false,
    })
    deadline?: Date;

    @Prop({
        required: false,
        trim: true,
    })
    inProgress?: string;

    @Prop({
        required: false,
        trim: true,
    })
    result?: string;

    @Prop({
        required: false,
        trim: true,
    })
    statusFix?: string;
}

export const WorkCustomerDatabaseName = 'workCustomers';
export const WorkCustomerSchema = SchemaFactory.createForClass(WorkCustomerEntity);

export type WorkCustomerDocument = WorkCustomerEntity & Document;

// Hooks
WorkCustomerSchema.pre<WorkCustomerDocument>('save', function (next) {
    next();
});
