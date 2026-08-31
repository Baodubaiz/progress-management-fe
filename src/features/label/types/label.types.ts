export type LabelItem = {
    id: string | number;
    projectId: string | number;
    name: string;
    color: string;
    taskCount?: number;
    createdAt?: string;
};

export type CreateLabelPayload = {
    projectId: string | number;
    name: string;
    color: string;
};

export type UpdateLabelPayload = {
    name?: string;
    color?: string;
};
