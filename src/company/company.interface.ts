import {IUserDocument} from "../user/user.interface";
import {CompanyDocument} from "./schema/company.schema";

export interface ICompanyDocument extends Omit<CompanyDocument, 'user'> {
    user: IUserDocument;
}

export interface ICompanyCreate {
    cif?: string;
    cifCompany?: string;
    position?: string;
    nameCompany?: string;
    relationshipOtherCompany?: string;
}

export type ICompanyUpdate = Pick<ICompanyCreate, 'cif'>;
