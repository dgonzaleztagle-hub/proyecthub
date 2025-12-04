import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GitBranch, Folder, Globe, Smartphone, Server } from 'lucide-react';
import { ProjectTabs } from '../components/project-tabs';
import type { Project, ProjectData } from '../types';

const iconMap = {
    web: Globe,
    mobile: Smartphone,
    backend: Server,
    other: Folder,
};

export default function ProjectDetails() {
    const { name } = useParams<{ name: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [data, setData] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProject();
    }, [name]);

    async function loadProject() {
        try {
            const { data: foundProject, error } = await supabase
                .from('projects')
                .select('*')
                .eq('name', name)
                .single();

            if (error) throw error;

            setProject(foundProject);
            // Initialize with default data if empty
            setData(foundProject.data || {
                clients: [],
                payments: [],
                notes: '',
                tasks: [],
                credentials: { custom: [] }
            });
        } catch (error) {
            console.error('Error loading project:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDataUpdate(newData: ProjectData) {
        if (!project) return;

        setData(newData); // Optimistic update

        try {
            const { error } = await supabase
                .from('projects')
                .update({ data: newData })
                .eq('id', project.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating project data:', error);
            // Revert on error could be implemented here
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-slate-400">Cargando proyecto...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-slate-400">Proyecto no encontrado</div>
            </div>
        );
    }

    const Icon = iconMap[project.type] || Folder;

    return (
        <main className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Volver al Dashboard
            </Link>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 glass-card">
                        <Icon size={40} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
                        <div className="flex items-center gap-4 text-slate-400">
                            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm">
                                {project.company}
                            </span>
                            <span className="text-sm">
                                Modificado: {new Date(project.lastModified || project.created_at).toLocaleDateString()}
                            </span>
                            {project.hasGit && (
                                <div className="flex flex-col">
                                    <span className="flex items-center gap-1 text-emerald-400 text-sm">
                                        <GitBranch size={14} />
                                        Git Repo
                                    </span>
                                    {project.repoUrl && (
                                        <span className="text-xs text-slate-500 max-w-[200px] truncate" title={project.repoUrl}>
                                            {project.repoUrl}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <ProjectTabs initialData={data} onDataUpdate={handleDataUpdate} />
        </main >
    );
}
