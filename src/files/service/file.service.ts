import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { IAwsS3Response } from 'src/aws/aws.interface';
import { DatabaseEntity } from 'src/database/database.decorator';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { PermissionEntity } from 'src/permission/schema/permission.schema';
import {
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
} from 'src/database/database.interface';
import {FileDocument, FileEntity} from '../schema/file.schema';
import {FileUploadSerialization} from '../serialization/file.upload.serialization';
import {FileListSerialization} from '../serialization/file.list.serialization';
import {FileGetSerialization} from '../serialization/file.get.serialization';
import {IFileCheckExist, IFileCreate, IFileDocument, IFileUpdate} from '../file.interface';
import {UserEntity} from "../../user/schema/user.schema";

@Injectable()
export class FileService {
    private readonly uploadPath: string;

    constructor(
        @DatabaseEntity(FileEntity.name)
        private readonly fileModel: Model<FileDocument>,
        private readonly helperStringService: HelperStringService,
    ) {
        this.uploadPath = 'report';
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<IFileDocument[]> {
        const files = this.fileModel.find(find).populate({
            path: 'user',
            model: UserEntity.name,
        });

        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            files.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            files.sort(options.sort);
        }

        return files.lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.fileModel.countDocuments(find);
    }

    async serializationProfile(
        data: IFileDocument
    ): Promise<FileUploadSerialization> {
        return plainToInstance(FileUploadSerialization, data);
    }

    async serializationList(
        data: IFileDocument[]
    ): Promise<FileListSerialization[]> {
        return plainToInstance(FileListSerialization, data);
    }

    async serializationGet(data: IFileDocument): Promise<FileGetSerialization> {
        return plainToInstance(FileGetSerialization, data);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.fileModel.findById(_id);

        if (options && options.populate && options.populate.user) {
            file.populate({
                path: 'user',
                model: UserEntity.name,
            });

            if (options.populate.permission) {
                file.populate({
                    path: 'user',
                    model: UserEntity.name,
                    populate: {
                        path: 'permissions',
                        model: PermissionEntity.name,
                    },
                });
            }
        }

        return file.lean();
    }

    async findOne<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const file = this.fileModel.findOne(find);

        if (options && options.populate && options.populate.user) {
            file.populate({
                path: 'user',
                model: UserEntity.name,
            });

            if (options.populate.permission) {
                file.populate({
                    path: 'user',
                    model: UserEntity.name,
                    populate: {
                        path: 'permissions',
                        model: PermissionEntity.name,
                    },
                });
            }
        }

        return file.lean();
    }

    async create({
        fileName,
        type,
        user,
        file,
    }: IFileCreate): Promise<FileDocument> {
        const fileEntity: FileEntity = {
            fileName,
            type,
            user: new Types.ObjectId(user),
            isActive: true,
            file
        };

        const create: FileDocument = new this.fileModel(fileEntity);
        return create.save();
    }

    async deleteOneById(_id: string): Promise<FileDocument> {
        return this.fileModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<FileDocument> {
        return this.fileModel.findOneAndDelete(find);
    }

    async updateOneById(
        _id: string,
        { fileName, type, file }: IFileUpdate
    ): Promise<FileDocument> {
        const fileModel: FileDocument = await this.fileModel.findById(_id);

        fileModel.fileName = fileName;
        fileModel.type = type || undefined;
        fileModel.file = file || undefined;
        return fileModel.save();
    }

    async checkExist(
        typeFile: string,
        _id?: string
    ): Promise<IFileCheckExist> {
        const existFile: Record<string, any> = await this.fileModel.exists({
            type: {
                $regex: new RegExp(typeFile),
                $options: 'i',
            },
            _id: { $nin: [new Types.ObjectId(_id)] },
        });

        return {
            file: !!existFile,
        };
    }

    async updatePhoto(_id: string, aws: IAwsS3Response): Promise<FileDocument> {
        const file: FileDocument = await this.fileModel.findById(_id);
        file.file = aws;

        return file.save();
    }

    async createRandomFilename(originalFileName: string): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);
        return {
            path: this.uploadPath,
            filename: `${filename}_${originalFileName}`,
        };
    }


    async inactive(_id: string): Promise<FileDocument> {
        const file: FileDocument = await this.fileModel.findById(_id);

        file.isActive = false;
        return file.save();
    }

    async active(_id: string): Promise<FileDocument> {
        const file: FileDocument = await this.fileModel.findById(_id);

        file.isActive = true;
        return file.save();
    }
}
