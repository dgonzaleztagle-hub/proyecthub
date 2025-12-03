import { Project } from '../types';
import { Folder, GitBranch, Globe, Smartphone, Server, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface ProjectCardProps {
    project: Project;
}

const iconMap = {
    web: Globe,
    mobile: Smartphone,
    backend: Server,
    other: Folder,
};

export function ProjectCard({ project }: ProjectCardProps) {
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
                    {project.company} • {new Date(project.lastModified).toLocaleDateString()}
                </p>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="text-slate-400 hover:text-white" />
                </div>
            </motion.div>
        </Link>
    );
}
