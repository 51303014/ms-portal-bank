export interface IParentCreate {
    cif?: string;
    cifRelevant?: string;
    fullNameRelevant?: string;
    relationship?: string;
    user?: string;
}

export type IParentUpdate = Pick<IParentCreate, 'cif'>;
