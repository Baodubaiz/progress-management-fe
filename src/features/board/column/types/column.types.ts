export type BoardColumn = {
    id: string | number;
    boardId: string | number;
    name: string;
    position?: string | number;
    createdAt?: string;
    updatedAt?: string;
    _count?: {
        tasks?: number;
    };
};

export type CreateColumnPayload = {
    boardId: string | number;
    name: string;
    position?: string | number;
};

export type UpdateColumnPayload = {
    name?: string;
    position?: string | number;
};

export type MoveColumnPayload = {
    prevPosition?: string | number | null;
    nextPosition?: string | number | null;
    targetPosition?: string | number | null;
};
