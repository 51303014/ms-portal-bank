export interface IWorkCustomerCreate {
    cif?: string;
    codeAM?: string;
    codeDepartmentLevelSix?: string;
    workHandle?: string;
    dateStart?: Date;
    deadline?: Date;
    inProgress: string;
    result: string;
    statusFix: string;
    user: string;
}

export type IWorkCustomerUpdate = Pick<IWorkCustomerCreate, 'cif'>;
