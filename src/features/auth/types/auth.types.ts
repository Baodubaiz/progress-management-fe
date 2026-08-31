export type AuthUser = {
    id: string | number;
    username: string;
    email: string;
    avatarUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    username: string;
    email: string;
    password: string;
};

export type AuthResponse = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
};
