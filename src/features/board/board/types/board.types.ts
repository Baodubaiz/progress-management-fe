export type BoardCreator = {
    id: string | number;
    username: string;
    email: string;
    avatarUrl?: string | null;
};

export type BoardListItem = {
    id: string | number;
    projectId: string | number;
    name: string;
    description?: string | null;
    createdBy: string | number;
    creator: BoardCreator;
    columnsCount: number;
    tasksCount: number;
    createdAt: string;
    updatedAt: string;
};

export type BoardListResponse = {
    boards: BoardListItem[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export type CreateBoardPayload = {
    projectId: string | number;
    name: string;
    description?: string | null;
    initialColumns?: string[];
};
