import { useState } from 'react';
import { ProjectData, Task } from '../../types';
import { Plus, CheckCircle2, Circle, Save } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BrainstormTabProps {
    data: ProjectData;
    onUpdate: (newData: ProjectData) => void;
}

export function BrainstormTab({ data, onUpdate }: BrainstormTabProps) {
    const [notes, setNotes] = useState(data.notes || '');
    const [isSaving, setIsSaving] = useState(false);

    async function handleSaveNotes() {
        setIsSaving(true);
        const newData = { ...data, notes };
        onUpdate(newData);
        setIsSaving(false);
    }

    async function handleAddTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        if (!title.trim()) return;

        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            completed: false,
        };

        const newData = { ...data, tasks: [...(data.tasks || []), newTask] };
        onUpdate(newData);
        (e.target as HTMLFormElement).reset();
    }

    async function toggleTask(taskId: string) {
        const newTasks = (data.tasks || []).map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const newData = { ...data, tasks: newTasks };
        onUpdate(newData);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notes Section */}
            <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Notas & Ideas</h3>
                    <button
                        onClick={handleSaveNotes}
                        disabled={isSaving}
                        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <Save size={16} />
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="flex-1 w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none min-h-[300px]"
                    placeholder="Escribe tus ideas aquí..."
                />
            </div>

            {/* Tasks Section */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">To-Do List</h3>

                <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                    <input
                        name="title"
                        placeholder="Nueva tarea..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors">
                        <Plus size={20} />
                    </button>
                </form>

                <div className="space-y-2">
                    {(data.tasks || []).map(task => (
                        <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group"
                        >
                            <div className={cn("text-slate-500 transition-colors", task.completed ? "text-emerald-500" : "group-hover:text-indigo-400")}>
                                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </div>
                            <span className={cn("flex-1 text-slate-300", task.completed && "line-through text-slate-500")}>
                                {task.title}
                            </span>
                        </div>
                    ))}
                    {(data.tasks || []).length === 0 && <p className="text-slate-500 text-center py-4">No hay tareas pendientes</p>}
                </div>
            </div>
        </div>
    );
}
