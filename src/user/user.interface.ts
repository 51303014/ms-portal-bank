import { IRoleDocument } from 'src/role/role.interface';
import { UserDocument } from './schema/user.schema';
import {ICodeDepartmentLevelSix} from "../codeDepartmentLevelSix/codeDepartmentLevelSix.interface";
import {CodeDepartmentLevelSixDocument} from "../codeDepartmentLevelSix/schema/codeDepartmentLevelSix.schema";

export interface IUserDocument extends Omit<UserDocument, 'role' | 'codeLevelSix'> {
    role: IRoleDocument;
    codeLevelSix?: ICodeDepartmentLevelSix;
}

export interface IUserCreate {
    firstName?: string;
    fullName?: string;
    lastName?: string;
    password?: string;
    passwordExpired?: Date;
    codeEmployee: string;
    codeAM?: string;
    codeAMForUserMultiple?: string;
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
    codeLevelSix?: string[];
    salt?: string;
}

export type IUserUpdate = Pick<IUserCreate, 'fullName' | 'codeBDS' | 'codeDepartment'| 'codeDepartmentLevelSix' |
    'email'| 'CRA' | 'identityCard' | 'department' | 'mobileNumber' | 'birthday' | 'position' |
    'codeAM' | 'codeAMForUserMultiple'>;

export interface IUserCheckExist {
    codeEmployee: boolean;
    mobileNumber: boolean;
}
