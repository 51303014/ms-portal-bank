import { IRoleDocument } from 'src/role/role.interface';
import { UserDocument } from './schema/user.schema';

export interface IUserDocument extends Omit<UserDocument, 'role'> {
    role: IRoleDocument;
}

export interface IUserCreate {
    firstName?: string;
    fullName?: string;
    lastName?: string;
    password?: string;
    passwordExpired?: Date;
    codeEmployee: string;
    codeAM?: string;
    codeDepartment?: string;
    codeDepartmentLevelSix?: string;
    codeBDS?: string;
    mobileNumber?: string;
    position?: string;
    birthday?: string;
    identityCard?: string;
    email?: string;
    CRA?: string;
    department?: string;
    role?: string;
    salt?: string;
}

export type IUserUpdate = Pick<IUserCreate, 'fullName' | 'codeBDS' | 'codeDepartment'| 'codeDepartmentLevelSix' |
    'email'| 'CRA' | 'identityCard' | 'department' | 'mobileNumber' | 'birthday' | 'position' |
    'codeAM'>;

export interface IUserCheckExist {
    codeEmployee: boolean;
    mobileNumber: boolean;
}
