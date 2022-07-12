import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types, Document} from 'mongoose';
import {IAwsS3Response} from 'src/aws/aws.interface';
import {UserEntity} from "../../user/schema/user.schema";

@Schema({timestamps: true, versionKey: false})
export class FileEntity {
    @Prop({
        required: true,
        index: true,
        lowercase: true,
        trim: true,
    })
    fileName: string;

    @Prop({
        required: false,
        lowercase: true,
        trim: true,
    })
    type: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    user: Types.ObjectId;

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;

    @Prop({
        required: true,
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
    file?: IAwsS3Response;
}

export const FileDatabaseName = 'files';
export const FileSchema = SchemaFactory.createForClass(FileEntity);

export type FileDocument = FileEntity & Document;

// Hooks
FileSchema.pre<FileDocument>('save', function (next) {
    if (this.fileName) {
        this.fileName = this.fileName.toLowerCase();
    }
    next();
});
