import { ProjectData } from '../../types';
import { TrendingUp, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface MetricsTabProps {
    data: ProjectData;
}

export function MetricsTab({ data }: MetricsTabProps) {
    const payments = data.payments || [];

    // Calculate implementation revenue (one-time payments)
    const implementationRevenue = payments
        .filter(p => p.type === 'implementation' && p.status === 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate monthly recurring revenue (MRR)
    const monthlyRevenue = payments
        .filter(p => p.type === 'maintenance' && p.status === 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate annual recurring revenue (ARR)
    const annualRevenue = monthlyRevenue * 12;

    // Total revenue
    const totalRevenue = implementationRevenue + monthlyRevenue;

    // Get recent payments for timeline
    const recentPayments = [...payments]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Main Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-sm text-slate-400">Implementación</span>
                    </div>
                    <p className="text-3xl font-bold text-white">${implementationRevenue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Pagos únicos totales</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                            <Calendar size={24} />
                        </div>
                        <span className="text-sm text-slate-400">MRR</span>
                    </div>
                    <p className="text-3xl font-bold text-white">${monthlyRevenue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Ingresos mensuales recurrentes</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-sm text-slate-400">ARR</span>
                    </div>
                    <p className="text-3xl font-bold text-white">${annualRevenue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Proyección anual</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                            <BarChart3 size={24} />
                        </div>
                        <span className="text-sm text-slate-400">Total</span>
                    </div>
                    <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Ingresos totales</p>
                </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Desglose de Ingresos</h3>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-400">Implementación</span>
                            <span className="text-sm font-medium text-white">
                                ${implementationRevenue.toLocaleString()} ({totalRevenue > 0 ? Math.round((implementationRevenue / totalRevenue) * 100) : 0}%)
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${totalRevenue > 0 ? (implementationRevenue / totalRevenue) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-400">Mantenimiento Mensual</span>
                            <span className="text-sm font-medium text-white">
                                ${monthlyRevenue.toLocaleString()} ({totalRevenue > 0 ? Math.round((monthlyRevenue / totalRevenue) * 100) : 0}%)
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${totalRevenue > 0 ? (monthlyRevenue / totalRevenue) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Actividad Reciente</h3>

                <div className="space-y-3">
                    {recentPayments.map(payment => {
                        const client = (data.clients || []).find(c => c.id === payment.clientId);
                        return (
                            <div key={payment.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${payment.type === 'implementation' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {payment.type === 'implementation' ? <DollarSign size={20} /> : <Calendar size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">${payment.amount.toLocaleString()}</p>
                                        <p className="text-xs text-slate-400">
                                            {payment.description} • {client?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">{new Date(payment.date).toLocaleDateString()}</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${payment.type === 'implementation'
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {payment.type === 'implementation' ? 'Implementación' : 'Mantenimiento'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {recentPayments.length === 0 && (
                        <p className="text-slate-500 text-center py-8">No hay pagos registrados aún</p>
                    )}
                </div>
            </div>
        </div>
    );
}
