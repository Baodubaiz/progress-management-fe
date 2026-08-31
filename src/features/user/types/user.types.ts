export type User = {
    id: string | number;
    username: string;
    email: string;
    avatarUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateUserPayload = {
    username: string;
    email: string;
    password: string;
    avatarUrl?: string | null;
};

export type UpdateUserPayload = {
    username?: string;
    avatarUrl?: string | null;
};

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export type UsersListResponse = {
    users: User[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};
