import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader2 } from 'lucide-react';

interface CreateProjectButtonProps {
    onProjectCreated: () => void;
}

export function CreateProjectButton({ onProjectCreated }: CreateProjectButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const company = formData.get('company') as 'Lovable' | 'CloudLab';
        const type = formData.get('type') as string;

        try {
            const { error } = await supabase
                .from('projects')
                .insert([{ name, company, type }]);

            if (!error) {
                setIsOpen(false);
                onProjectCreated();
            } else {
                setError('Error al crear el proyecto. Verifica que no exista ya.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor.');
        }
        setIsLoading(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
            >
                <Plus size={20} />
                Nuevo Proyecto
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-panel w-full max-w-md p-6 rounded-2xl relative z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Nuevo Proyecto</h2>
                                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre del Proyecto</label>
                                    <input
                                        name="name"
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="mi-proyecto-genial"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Empresa</label>
                                    <select
                                        name="company"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="CloudLab">CloudLab</option>
                                        <option value="Lovable">Lovable</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
                                    <select
                                        name="type"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="web">Web App</option>
                                        <option value="mobile">Mobile App</option>
                                        <option value="backend">Backend API</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>

                                {error && <p className="text-red-400 text-sm">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Crear Proyecto'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
