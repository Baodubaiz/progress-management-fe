export type ProjectMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type ProjectCreator = {
    id: string | number;
    username: string;
    email: string;
    avatarUrl?: string | null;
};

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

export type ProjectListItem = {
    id: string | number;
    name: string;
    description?: string | null;
    createdBy: string | number;
    creator: ProjectCreator;
    userRole: ProjectMemberRole;
    membersCount: number;
    boardsCount: number;
    createdAt: string;
    updatedAt: string;
};

export type ProjectListResponse = {
    projects: ProjectListItem[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export type ProjectDetail = {
    id: string | number;
    name: string;
    description?: string | null;
    createdBy: string | number;
    creator: ProjectCreator;
    userRole: ProjectMemberRole;
    members: ProjectMember[];
    boards: Array<{
        id: string | number;
        name: string;
        description?: string | null;
        createdAt: string;
        _count?: {
            columns: number;
        };
    }>;
    labels: Array<{
        id: string | number;
        name: string;
        color: string;
    }>;
    createdAt: string;
    updatedAt: string;
};

export type CreateProjectPayload = {
    name: string;
    description?: string | null;
};

export type UpdateProjectPayload = {
    name?: string;
    description?: string | null;
};
