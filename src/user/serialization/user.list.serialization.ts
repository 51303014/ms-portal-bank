import { Exclude, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { IAwsS3Response } from 'src/aws/aws.interface';

export class UserListSerialization {
    @Type(() => String)
    readonly _id: string;

    readonly role: Types.ObjectId;

    readonly codeEmployee: string;
    readonly mobileNumber: string;
    readonly isActive: boolean;
    readonly fullName: string;
    readonly department: string;


    @Exclude()
    readonly password: string;

    @Exclude()
    readonly passwordExpired: Date;

    @Exclude()
    readonly salt: string;

    readonly createdAt: Date;

    @Exclude()
    readonly updatedAt: Date;
}
