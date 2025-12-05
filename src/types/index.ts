export interface Project {
    id: string;
    name: string;
    company: 'Lovable' | 'CloudLab';
    type: 'web' | 'mobile' | 'backend' | 'other';
    created_at: string;
    // Optional fields for backward compatibility or future use
    path?: string;
    hasGit?: boolean;
    repoUrl?: string;
    lastModified?: string;
    stats?: ProjectStats;
    data?: ProjectData;
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
    type: 'implementation' | 'maintenance';
    installment?: {
        current: number;
        total: number;
    };
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
