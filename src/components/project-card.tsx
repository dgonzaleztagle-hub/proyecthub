import { Project } from '../types';
import { Folder, GitBranch, Globe, Smartphone, Server, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface ProjectCardProps {
    project: Project;
    onDelete?: (projectId: string) => void;
}

const iconMap = {
    web: Globe,
    mobile: Smartphone,
    backend: Server,
    other: Folder,
};

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
    const Icon = iconMap[project.type] || Folder;

    return (
        <Link to={`/project/${project.name}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-6 rounded-2xl relative group cursor-pointer"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                        "p-3 rounded-xl bg-gradient-to-br",
                        project.company === 'Lovable' ? "from-pink-500/20 to-rose-500/20 text-pink-400" : "from-blue-500/20 to-cyan-500/20 text-blue-400"
                    )}>
                        <Icon size={24} />
                    </div>
                    {project.hasGit && (
                        <div className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg" title="Git Repository Detected">
                            <GitBranch size={16} />
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {project.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                    {project.company} • {new Date(project.lastModified || project.created_at).toLocaleDateString()}
                </p>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (confirm(`¿Eliminar proyecto "${project.name}"?`)) {
                                    onDelete(project.id);
                                }
                            }}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400 hover:text-red-300"
                            title="Eliminar proyecto"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </motion.div>
        </Link >
    );
}
