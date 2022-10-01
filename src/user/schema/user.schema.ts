import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import {IAwsS3Response} from 'src/aws/aws.interface';
import {RoleEntity} from 'src/role/schema/role.schema';

@Schema({timestamps: true, versionKey: false})
export class UserEntity {
    @Prop({
        required: false,
        trim: true,
    })
    fullName?: string;

    @Prop({
        required: false,
    })
    mobileNumber?: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        trim: true,
    })
    codeEmployee: string;

    @Prop({
        required: false,
        // type: Array,
        // default: [],
    })
    codeAM?: string;


    @Prop({
        required: false,
        type: Array,
        default: [],
    })
    codeAMForUserMultiple?: string[];

    @Prop({
        required: false,
        trim: true,
    })
    codeDepartment?: string;

    @Prop({
        required: false,
        lowercase: true,
        trim: true,
    })
    codeDepartmentLevelSix?: string;

    @Prop({
        required: false,
        trim: true,
    })
    codeBDS?: string;

    @Prop({
        trim: true,
    })
    position: string;

    @Prop({
        lowercase: true,
        trim: true,
    })
    birthday: string;

    @Prop({
        lowercase: true,
        trim: true,
    })
    identityCard: string;

    @Prop({
        lowercase: true,
        trim: true,
    })
    email: string;

    @Prop({
        lowercase: true,
        trim: true,
    })
    CRA: string;

    @Prop({
        required: false,
        lowercase: true,
        trim: true,
    })
    department?: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: RoleEntity.name,
    })
    role: Types.ObjectId;

    @Prop({
        required: false,
        type: Array,
        default: [],
    })
    codeLevelSix?: string[];

    @Prop({
        required: false,
    })
    password?: string;

    @Prop({
        required: false,
    })
    passwordExpired?: Date;

    @Prop({
        required: false,
    })
    salt?: string;

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;

    @Prop({
        required: false,
        _id: false,
        type: {
            path: String,
            pathWithFilename: String,
            filename: String,
            completedUrl: String,
            baseUrl: String,
            mime: String,
        },
    })
    photo?: IAwsS3Response;
}

export const UserDatabaseName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

// Hooks
UserSchema.pre<UserDocument>('save', function (next) {
    next();
});
