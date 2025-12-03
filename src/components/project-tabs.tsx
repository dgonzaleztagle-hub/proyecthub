import { useState } from 'react';
import { Project, ProjectData } from '../types';
import { AccountingTab } from './tabs/accounting-tab';
import { BrainstormTab } from './tabs/brainstorm-tab';
import { CredentialsTab } from './tabs/credentials-tab';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectTabsProps {
    project: Project;
    initialData: ProjectData | null;
    onDataUpdate: () => void;
}

export function ProjectTabs({ project, initialData, onDataUpdate }: ProjectTabsProps) {
    const [activeTab, setActiveTab] = useState<'accounting' | 'brainstorm' | 'credentials'>('accounting');
    const [data, setData] = useState<ProjectData>(initialData || {
        clients: [],
        payments: [],
        notes: '',
        tasks: [],
        credentials: { custom: [] }
    });

    async function handleDataUpdate(newData: ProjectData) {
        setData(newData);
        try {
            await fetch(`http://localhost:3001/api/projects/${project.name}/data`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });
            onDataUpdate();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }

    const tabs = [
        { id: 'accounting', label: 'Contabilidad' },
        { id: 'brainstorm', label: 'Brainstorm & To-Do' },
        { id: 'credentials', label: 'Credenciales' },
    ] as const;

    return (
        <div>
            <div className="flex gap-4 mb-8 border-b border-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "pb-4 px-2 text-sm font-medium transition-colors relative",
                            activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'accounting' && (
                        <AccountingTab data={data} onUpdate={handleDataUpdate} />
                    )}
                    {activeTab === 'brainstorm' && (
                        <BrainstormTab data={data} onUpdate={handleDataUpdate} />
                    )}
                    {activeTab === 'credentials' && (
                        <CredentialsTab data={data} onUpdate={handleDataUpdate} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
