export interface Project {
    name: string;
    path: string;
    company: 'Lovable' | 'CloudLab';
    type: 'web' | 'mobile' | 'backend' | 'other';
    hasGit: boolean;
    repoUrl?: string;
    lastModified: string;
    stats?: ProjectStats;
}

export interface ProjectStats {
    totalRevenue: number;
    activeClients: number;
    pendingTasks: number;
}

export interface Client {
    id: string;
    name: string;
    email?: string;
    status: 'active' | 'inactive';
    startDate: string;
}

export interface Payment {
    id: string;
    clientId: string;
    amount: number;
    date: string;
    description: string;
    status: 'paid' | 'pending';
}

export interface ProjectData {
    clients: Client[];
    payments: Payment[];
    notes: string;
    tasks: Task[];
    credentials?: Credentials;
}

export interface Credentials {
    github?: {
        repoUrl: string;
    };
    supabase?: {
        projectUrl: string;
        anonKey: string;
        serviceRoleKey: string;
    };
    vercel?: {
        projectUrl: string;
        deploymentUrl: string;
    };
    custom: Array<{
        id: string;
        name: string;
        value: string;
        isSecret: boolean;
    }>;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
}
