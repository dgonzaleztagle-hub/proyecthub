import { useState, useEffect } from 'react';
import { ProjectCard } from '../components/project-card';
import { CreateProjectButton } from '../components/create-project-button';
import type { Project } from '../types';

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    async function loadProjects() {
        try {
            const response = await fetch('http://localhost:3001/api/projects');
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    }

    const lovableProjects = projects.filter(p => p.company === 'Lovable');
    const cloudlabProjects = projects.filter(p => p.company === 'CloudLab');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-slate-400">Cargando proyectos...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        <span className="text-gradient">Project Hub</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Centro de control de tus empresas</p>
                </div>

                <CreateProjectButton onProjectCreated={loadProjects} />
            </header>

            <div className="space-y-16">
                {/* Lovable Section */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-white">Lovable</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-pink-500/50 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lovableProjects.map((project) => (
                            <ProjectCard key={project.path} project={project} />
                        ))}
                        {lovableProjects.length === 0 && (
                            <div className="col-span-full p-8 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-center">
                                No hay proyectos en Lovable aún.
                            </div>
                        )}
                    </div>
                </section>

                {/* CloudLab Section */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-white">CloudLab</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cloudlabProjects.map((project) => (
                            <ProjectCard key={project.path} project={project} />
                        ))}
                        {cloudlabProjects.length === 0 && (
                            <div className="col-span-full p-8 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-center">
                                No hay proyectos en CloudLab aún.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
