import { useState } from 'react';
import { ProjectData, Client, Payment } from '../../types';
import { Plus, DollarSign, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface AccountingTabProps {
    data: ProjectData;
    onUpdate: (newData: ProjectData) => void;
}

export function AccountingTab({ data, onUpdate }: AccountingTabProps) {
    const [showAddClient, setShowAddClient] = useState(false);
    const [showAddPayment, setShowAddPayment] = useState(false);

    const totalRevenue = data.payments.reduce((acc, curr) => acc + curr.amount, 0);
    const activeClients = data.clients.filter(c => c.status === 'active').length;

    async function handleAddClient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newClient: Client = {
            id: crypto.randomUUID(),
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            status: 'active',
            startDate: new Date().toISOString(),
        };

        const newData = { ...data, clients: [...data.clients, newClient] };
        onUpdate(newData);
        setShowAddClient(false);
    }

    async function handleAddPayment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newPayment: Payment = {
            id: crypto.randomUUID(),
            clientId: formData.get('clientId') as string,
            amount: Number(formData.get('amount')),
            description: formData.get('description') as string,
            date: formData.get('date') as string || new Date().toISOString(),
            status: 'paid',
        };

        const newData = { ...data, payments: [...data.payments, newPayment] };
        onUpdate(newData);
        setShowAddPayment(false);
    }

    return (
        <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-slate-400">Ingresos Totales</span>
                    </div>
                    <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                            <Users size={24} />
                        </div>
                        <span className="text-slate-400">Clientes Activos</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{activeClients}</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-slate-400">Proyección Mensual</span>
                    </div>
                    <p className="text-3xl font-bold text-white">$0</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Clients Section */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Clientes</h3>
                        <button
                            onClick={() => setShowAddClient(!showAddClient)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-indigo-400"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {showAddClient && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 space-y-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700"
                            onSubmit={handleAddClient}
                        >
                            <input name="name" placeholder="Nombre del Cliente" required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                            <input name="email" placeholder="Email (opcional)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm">Guardar Cliente</button>
                        </motion.form>
                    )}

                    <div className="space-y-3">
                        {data.clients.map(client => (
                            <div key={client.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <div>
                                    <p className="font-medium text-white">{client.name}</p>
                                    <p className="text-xs text-slate-400">{client.email}</p>
                                </div>
                                <span className={cn("px-2 py-1 rounded-full text-xs", client.status === 'active' ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400")}>
                                    {client.status}
                                </span>
                            </div>
                        ))}
                        {data.clients.length === 0 && <p className="text-slate-500 text-center py-4">No hay clientes registrados</p>}
                    </div>
                </div>

                {/* Payments Section */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Pagos Recientes</h3>
                        <button
                            onClick={() => setShowAddPayment(!showAddPayment)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-emerald-400"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {showAddPayment && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 space-y-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700"
                            onSubmit={handleAddPayment}
                        >
                            <select name="clientId" required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white">
                                <option value="">Seleccionar Cliente</option>
                                {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <input name="amount" type="number" placeholder="Monto" required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                            <input name="description" placeholder="Descripción" required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                            <input name="date" type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                            <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm">Registrar Pago</button>
                        </motion.form>
                    )}

                    <div className="space-y-3">
                        {data.payments.map(payment => {
                            const client = data.clients.find(c => c.id === payment.clientId);
                            return (
                                <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div>
                                        <p className="font-medium text-white">${payment.amount.toLocaleString()}</p>
                                        <p className="text-xs text-slate-400">{payment.description} • {client?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">{new Date(payment.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {data.payments.length === 0 && <p className="text-slate-500 text-center py-4">No hay pagos registrados</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
