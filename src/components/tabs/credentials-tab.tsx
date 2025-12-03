import { useState } from 'react';
import { ProjectData, Credentials } from '../../types';
import { Save, Eye, EyeOff, Plus, Trash2, Github, Database, Globe, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CredentialsTabProps {
    data: ProjectData;
    onUpdate: (newData: ProjectData) => void;
}

export function CredentialsTab({ data, onUpdate }: CredentialsTabProps) {
    const [credentials, setCredentials] = useState<Credentials>(data.credentials || {
        custom: []
    });
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);

    const toggleSecret = (key: string) => {
        setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const newData = { ...data, credentials };
        onUpdate(newData);
        // Simulate a small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
    };

    const updateGithub = (value: string) => {
        setCredentials(prev => ({
            ...prev,
            github: { ...prev.github, repoUrl: value }
        }));
    };

    const updateSupabase = (field: keyof NonNullable<Credentials['supabase']>, value: string) => {
        setCredentials(prev => ({
            ...prev,
            supabase: {
                projectUrl: '',
                anonKey: '',
                serviceRoleKey: '',
                ...prev.supabase,
                [field]: value
            }
        }));
    };

    const updateVercel = (field: keyof NonNullable<Credentials['vercel']>, value: string) => {
        setCredentials(prev => ({
            ...prev,
            vercel: {
                projectUrl: '',
                deploymentUrl: '',
                ...prev.vercel,
                [field]: value
            }
        }));
    };

    const addCustomCredential = () => {
        setCredentials(prev => ({
            ...prev,
            custom: [
                ...prev.custom,
                { id: crypto.randomUUID(), name: '', value: '', isSecret: true }
            ]
        }));
    };

    const updateCustomCredential = (id: string, field: 'name' | 'value' | 'isSecret', value: string | boolean) => {
        setCredentials(prev => ({
            ...prev,
            custom: prev.custom.map(c => c.id === id ? { ...c, [field]: value } : c)
        }));
    };

    const removeCustomCredential = (id: string) => {
        setCredentials(prev => ({
            ...prev,
            custom: prev.custom.filter(c => c.id !== id)
        }));
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-end sticky top-0 z-10 bg-[#0f172a]/80 backdrop-blur-sm py-4 -my-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Save size={18} />
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            {/* GitHub Section */}
            <section className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-white/10">
                        <Github size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">GitHub</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Repository URL</label>
                        <input
                            value={credentials.github?.repoUrl || ''}
                            onChange={(e) => updateGithub(e.target.value)}
                            placeholder="https://github.com/username/repo"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </section>

            {/* Supabase Section */}
            <section className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                        <Database size={24} className="text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Supabase</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Project URL</label>
                        <input
                            value={credentials.supabase?.projectUrl || ''}
                            onChange={(e) => updateSupabase('projectUrl', e.target.value)}
                            placeholder="https://xyz.supabase.co"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Anon Key</label>
                            <div className="relative">
                                <input
                                    type={showSecrets['supabase_anon'] ? 'text' : 'password'}
                                    value={credentials.supabase?.anonKey || ''}
                                    onChange={(e) => updateSupabase('anonKey', e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                                />
                                <button
                                    onClick={() => toggleSecret('supabase_anon')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showSecrets['supabase_anon'] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Service Role Key</label>
                            <div className="relative">
                                <input
                                    type={showSecrets['supabase_service'] ? 'text' : 'password'}
                                    value={credentials.supabase?.serviceRoleKey || ''}
                                    onChange={(e) => updateSupabase('serviceRoleKey', e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                                />
                                <button
                                    onClick={() => toggleSecret('supabase_service')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showSecrets['supabase_service'] ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vercel Section */}
            <section className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-black border border-slate-700">
                        <Globe size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Vercel</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Project URL</label>
                        <input
                            value={credentials.vercel?.projectUrl || ''}
                            onChange={(e) => updateVercel('projectUrl', e.target.value)}
                            placeholder="https://vercel.com/..."
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Deployment URL</label>
                        <input
                            value={credentials.vercel?.deploymentUrl || ''}
                            onChange={(e) => updateVercel('deploymentUrl', e.target.value)}
                            placeholder="https://my-project.vercel.app"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
                        />
                    </div>
                </div>
            </section>

            {/* Custom Credentials Section */}
            <section className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/20">
                            <Key size={24} className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Credenciales Adicionales</h3>
                    </div>
                    <button
                        onClick={addCustomCredential}
                        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <Plus size={16} />
                        Agregar
                    </button>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {credentials.custom.map((cred) => (
                            <motion.div
                                key={cred.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex gap-4 items-start bg-slate-900/30 p-4 rounded-xl border border-slate-800"
                            >
                                <div className="flex-1 space-y-2">
                                    <input
                                        value={cred.name}
                                        onChange={(e) => updateCustomCredential(cred.id, 'name', e.target.value)}
                                        placeholder="Nombre (ej. AWS Access Key)"
                                        className="w-full bg-transparent border-b border-slate-700 px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    />
                                    <div className="relative">
                                        <input
                                            type={cred.isSecret && !showSecrets[cred.id] ? 'password' : 'text'}
                                            value={cred.value}
                                            onChange={(e) => updateCustomCredential(cred.id, 'value', e.target.value)}
                                            placeholder="Valor"
                                            className="w-full bg-transparent border-b border-slate-700 px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
                                        />
                                        <button
                                            onClick={() => toggleSecret(cred.id)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                        >
                                            {cred.isSecret && !showSecrets[cred.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => updateCustomCredential(cred.id, 'isSecret', !cred.isSecret)}
                                        className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            cred.isSecret ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:text-slate-300"
                                        )}
                                        title="Es secreto"
                                    >
                                        <Key size={16} />
                                    </button>
                                    <button
                                        onClick={() => removeCustomCredential(cred.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {credentials.custom.length === 0 && (
                        <p className="text-slate-500 text-center py-4 text-sm">No hay credenciales adicionales</p>
                    )}
                </div>
            </section>
        </div>
    );
}
