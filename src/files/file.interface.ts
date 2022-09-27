import {FileDocument} from "./schema/file.schema";
import {IUserDocument} from "../user/user.interface";
import {IAwsS3Response, ILocalFileResponse} from "../aws/aws.interface";

export interface IFileDocument extends Omit<FileDocument, 'user'> {
    user: IUserDocument;
}

export interface IFileCreate {
    fileName: string;
    type?: string;
    _id?: string;
    user: string;
    file: ILocalFileResponse;
}

export type IFileUpdate = Pick<IFileCreate, 'fileName' | 'type' | 'file'>;

export interface IFileCheckExist {
    file: boolean;
}

export type KindOfFile = 'hdv' | 'credit'

export interface TypeFile {
    type: KindOfFile
}
