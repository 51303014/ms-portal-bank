export interface IWorkCustomerCreate {
    cif?: string;
    workHandle?: string;
    dateStart?: Date;
    deadline?: Date;
    inProgress: string;
    result: string;
    statusFix: string;
}

export type IWorkCustomerUpdate = Pick<IWorkCustomerCreate, 'cif'>;
