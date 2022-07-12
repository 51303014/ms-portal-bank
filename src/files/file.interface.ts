import {FileDocument} from "./schema/file.schema";
import {IUserDocument} from "../user/user.interface";
import {IAwsS3Response} from "../aws/aws.interface";

export interface IFileDocument extends Omit<FileDocument, 'user'> {
    user: IUserDocument;
}

export interface IFileCreate {
    fileName: string;
    type?: string;
    user: string;
    awsFile: IAwsS3Response;
}

export type IFileUpdate = Pick<IFileCreate, 'fileName' | 'type'>;

export interface IFileCheckExist {
    file: boolean;
    user: boolean;
}

export type TypeFile = 'HDV'
