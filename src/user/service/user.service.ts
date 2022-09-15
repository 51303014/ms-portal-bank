import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {
    IUserDocument,
    IUserCreate,
    IUserUpdate,
    IUserCheckExist,
} from 'src/user/user.interface';
import {Types} from 'mongoose';
import {plainToInstance} from 'class-transformer';
import {IAwsS3Response} from 'src/aws/aws.interface';
import {IAuthPassword} from 'src/auth/auth.interface';
import {ConfigService} from '@nestjs/config';
import {DatabaseEntity} from 'src/database/database.decorator';
import {HelperStringService} from 'src/utils/helper/service/helper.string.service';
import {UserDocument, UserEntity} from '../schema/user.schema';
import {RoleEntity} from 'src/role/schema/role.schema';
import {PermissionEntity} from 'src/permission/schema/permission.schema';
import {
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
} from 'src/database/database.interface';
import {UserProfileSerialization} from '../serialization/user.profile.serialization';
import {UserListSerialization} from '../serialization/user.list.serialization';
import {UserGetSerialization} from '../serialization/user.get.serialization';
import {HelperHashService} from "../../utils/helper/service/helper.hash.service";
import {HelperDateService} from "../../utils/helper/service/helper.date.service";

@Injectable()
export class UserService {
    private readonly uploadPath: string;

    constructor(
        @DatabaseEntity(UserEntity.name)
        private readonly userModel: Model<UserDocument>,
        private readonly helperStringService: HelperStringService,
        private readonly helperHashService: HelperHashService,
        private readonly helperDateService: HelperDateService,
        private readonly configService: ConfigService,
    ) {
        this.uploadPath = this.configService.get<string>('user.uploadPath');
    }

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions
    ): Promise<IUserDocument[]> {
        const users = this.userModel.find(find).populate({
            path: 'role',
            model: RoleEntity.name,
        });

        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            users.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            users.sort(options.sort);
        }

        return users.lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.userModel.countDocuments(find);
    }

    async serializationProfile(
        data: IUserDocument
    ): Promise<UserProfileSerialization> {
        return plainToInstance(UserProfileSerialization, data);
    }

    async serializationList(
        data: IUserDocument[]
    ): Promise<UserListSerialization[]> {
        return plainToInstance(UserListSerialization, data);
    }

    async serializationGet(data: IUserDocument): Promise<UserGetSerialization> {
        return plainToInstance(UserGetSerialization, data);
    }

    async findOneById<T>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const user = this.userModel.findById(_id);

        if (options && options.populate && options.populate.role) {
            user.populate({
                path: 'role',
                model: RoleEntity.name,
            });

            if (options.populate.permission) {
                user.populate({
                    path: 'role',
                    model: RoleEntity.name,
                    populate: {
                        path: 'permissions',
                        model: PermissionEntity.name,
                    },
                });
            }
        }

        return user.lean();
    }

    async findOne<T>(
        find?: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<T> {
        const user = this.userModel.findOne(find);

        if (options && options.populate && options.populate.role) {
            user.populate({
                path: 'role',
                model: RoleEntity.name,
            });

            if (options.populate.permission) {
                user.populate({
                    path: 'role',
                    model: RoleEntity.name,
                    populate: {
                        path: 'permissions',
                        model: PermissionEntity.name,
                    },
                });
            }
        }

        return user.lean();
    }

    async createPassword(password: string): Promise<IAuthPassword> {
        const saltLength: number = this.configService.get<number>(
            'auth.password.saltLength'
        );

        const salt: string = this.helperHashService.randomSalt(saltLength);

        const passwordExpiredInMs: number = this.configService.get<number>(
            'auth.password.expiredInMs'
        );
        const passwordExpired: Date =
            this.helperDateService.forwardInMilliseconds(passwordExpiredInMs);
        const passwordHash = this.helperHashService.bcrypt(password, salt);
        return {
            passwordHash,
            passwordExpired,
            salt,
        };
    }

    async create({
                     fullName,
                     codeAM,
                     codeDepartment,
                     codeLevelSix,
                     codeDepartmentLevelSix,
                     codeBDS,
                     position,
                     birthday,
                     identityCard,
                     email,
                     CRA,
                     department,
                     passwordExpired,
                     salt,
                     codeEmployee,
                     mobileNumber,
                     role,
                 }: IUserCreate): Promise<UserDocument> {
        const password = await this.createPassword(
            'aaAA@@123444'
        );
        const user: UserEntity = {
            fullName,
            codeAM,
            codeBDS,
            codeDepartment,
            codeDepartmentLevelSix,
            position,
            birthday,
            identityCard,
            email,
            CRA,
            department,
            codeEmployee,
            mobileNumber,
            password: password.passwordHash,
            role: new Types.ObjectId(role),
            codeLevelSix,
            isActive: true,
            salt,
            passwordExpired,
        };

        const create: UserDocument = new this.userModel(user);
        return create.save();
    }

    async deleteOneById(_id: string): Promise<UserDocument> {
        return this.userModel.findByIdAndDelete(_id);
    }

    async deleteOne(find: Record<string, any>): Promise<UserDocument> {
        return this.userModel.findOneAndDelete(find);
    }

    async updateUserByCodeAM(
        codeEmployee: string,
        {codeAM}: IUserUpdate
    ): Promise<UserDocument> {
        const user: UserDocument = await this.userModel.findOne({codeEmployee});
        user.codeAMForUserMultiple = [...user.codeAMForUserMultiple, codeAM];
        return user.save();
    }

    async updateOneById(
        codeEmployee: string,
        {
            fullName, codeBDS, codeDepartment,
            codeDepartmentLevelSix,
            email, CRA, identityCard,
            department, mobileNumber,
            birthday, position,
            codeAM
        }: IUserUpdate
    ): Promise<UserDocument> {
        const user: UserDocument = await this.userModel.findOne({codeEmployee});

        user.fullName = fullName || undefined;
        user.codeBDS = codeBDS || undefined;
        user.codeAM = codeAM || undefined;
        user.codeDepartment = codeDepartment || undefined;
        user.department = department || undefined;
        user.codeDepartmentLevelSix = codeDepartmentLevelSix || undefined;
        user.email = email || undefined;
        user.CRA = CRA || undefined;
        user.identityCard = identityCard || undefined;
        user.mobileNumber = mobileNumber || undefined;
        user.birthday = birthday || undefined;
        user.position = position || undefined;


        return user.save();
    }

    async updateUserByCodeEmployee(
        codeEmployee: string,
        {
            codeDepartmentLevelSix,
            codeLevelSix,
            role,
            position,
            codeAM
        }: IUserUpdate
    ): Promise<UserDocument> {
        const user: UserDocument = await this.userModel.findOne({codeEmployee});

        if (codeAM) {
            user.codeAM = codeAM;
        }
        if (codeDepartmentLevelSix) {
            user.codeDepartmentLevelSix = codeDepartmentLevelSix;
        }

        if (position) {
            user.position = position;
        }

        if (codeLevelSix && codeLevelSix.length > 0) {
            user.codeLevelSix = codeLevelSix;
        }
        if (role) {
            user.role = new Types.ObjectId(role)
        }

        return user.save();
    }

    async checkExistCodeEmployee(
        code: string,
        _id?: string
    ): Promise<boolean> {
        const existCodeEmployee: Record<string, any> = await this.userModel.exists({
            codeEmployee: {
                $regex: new RegExp(code),
                $options: 'i',
            },
            _id: {$nin: [new Types.ObjectId(_id)]},
        });
        return !!existCodeEmployee
    }

    async checkExist(
        codeEmployee: string,
        _id?: string
    ): Promise<IUserCheckExist> {
        const existCodeEmployee: Record<string, any> = await this.userModel.exists({
            codeEmployee: {
                $regex: new RegExp(codeEmployee),
                $options: 'i',
            },
            _id: {$nin: [new Types.ObjectId(_id)]},
        });

        return {
            codeEmployee: !!existCodeEmployee,
        };
    }

    async updatePhoto(_id: string, aws: IAwsS3Response): Promise<UserDocument> {
        const user: UserDocument = await this.userModel.findById(_id);
        user.photo = aws;

        return user.save();
    }

    async createRandomFilename(): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);

        return {
            path: this.uploadPath,
            filename: filename,
        };
    }

    async updatePassword(
        _id: string,
        {salt, passwordHash, passwordExpired}: IAuthPassword
    ): Promise<UserDocument> {
        const auth: UserDocument = await this.userModel.findById(_id);

        auth.password = passwordHash;
        auth.passwordExpired = passwordExpired;
        auth.salt = salt;

        return auth.save();
    }

    async updatePasswordExpired(
        _id: string,
        passwordExpired: Date
    ): Promise<UserDocument> {
        const auth: UserDocument = await this.userModel.findById(_id);
        auth.passwordExpired = passwordExpired;

        return auth.save();
    }

    async inactive(_id: string): Promise<UserDocument> {
        const user: UserDocument = await this.userModel.findById(_id);

        user.isActive = false;
        return user.save();
    }

    async active(_id: string): Promise<UserDocument> {
        const user: UserDocument = await this.userModel.findById(_id);

        user.isActive = true;
        return user.save();
    }
}
