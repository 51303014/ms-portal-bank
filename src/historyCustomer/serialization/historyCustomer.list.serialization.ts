import { Exclude, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class HistoryCustomerListSerialization {
    @Type(() => String)
    readonly _id: string;

    @Exclude()
    readonly role: Types.ObjectId;

    readonly codeEmployee: string;
    readonly cif: string;
    readonly mobileNumber: string;
    readonly isActive: boolean;
    readonly fullName: string;

    @Exclude()
    readonly passwordExpired: Date;

    @Exclude()
    readonly salt: string;

    readonly createdAt: Date;

    @Exclude()
    readonly updatedAt: Date;
}
