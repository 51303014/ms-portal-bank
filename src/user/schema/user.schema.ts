import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import {IAwsS3Response} from 'src/aws/aws.interface';
import {RoleEntity} from 'src/role/schema/role.schema';
import {PermissionEntity} from "../../permission/schema/permission.schema";
import {CodeDepartmentLevelSixEntity} from "../../codeDepartmentLevelSix/schema/codeDepartmentLevelSix.schema";

@Schema({timestamps: true, versionKey: false})
export class UserEntity {
    @Prop({
        required: false,
        lowercase: true,
        trim: true,
    })
    firstName?: string;

    @Prop({
        required: false,
        lowercase: true,
        trim: true,
    })
    lastName?: string;

    @Prop({
        required: false,
        lowercase: true,
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
        lowercase: true,
        trim: true,
    })
    codeEmployee: string;

    @Prop({
        required: false,
        lowercase: true,
        trim: true,
    })
    codeAM?: string;

    @Prop({
        required: false,
        lowercase: true,
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
        unique: true,
        lowercase: true,
        trim: true,
    })
    codeBDS?: string;

    @Prop({
        lowercase: true,
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
        lowercase: true,
        trim: true,
    })
    department: string;

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
        ref: CodeDepartmentLevelSixEntity.name,
    })
    codeLevelSix?: Types.ObjectId[];

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
