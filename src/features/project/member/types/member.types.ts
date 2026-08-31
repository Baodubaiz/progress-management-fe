export type ProjectMemberRole = 'OWNER' | 'MEMBER';

export type ProjectMember = {
    id?: string | number;
    projectId?: string | number;
    userId?: string | number;
    role: ProjectMemberRole;
    joinedAt?: string;
    user: {
        id: string | number;
        username: string;
        email: string;
        avatarUrl?: string | null;
    };
};

export type AddMemberPayload = {
    email: string;
    role?: ProjectMemberRole;
};

export type UpdateMemberRolePayload = {
    role: ProjectMemberRole;
};
