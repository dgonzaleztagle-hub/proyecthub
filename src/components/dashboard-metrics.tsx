import { ProjectData } from '../types';
import { TrendingUp, DollarSign, Calendar, BarChart3, Building2 } from 'lucide-react';

interface DashboardMetricsProps {
    projects: Array<{ id: string; name: string; company: string; data?: ProjectData }>;
}

export function DashboardMetrics({ projects }: DashboardMetricsProps) {
    // Calculate consolidated metrics from all projects
    const allPayments = projects.flatMap(p => (p.data?.payments || []));

    const totalImplementation = allPayments
        .filter(p => p.type === 'implementation' && p.status === 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalMRR = allPayments
        .filter(p => p.type === 'maintenance' && p.status === 'paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalARR = totalMRR * 12;
    const grandTotal = totalImplementation + totalMRR;

    // Calculate per-project breakdown
    const projectBreakdown = projects.map(project => {
        const payments = project.data?.payments || [];
        const implementation = payments
            .filter(p => p.type === 'implementation' && p.status === 'paid')
            .reduce((acc, curr) => acc + curr.amount, 0);
        const maintenance = payments
            .filter(p => p.type === 'maintenance' && p.status === 'paid')
            .reduce((acc, curr) => acc + curr.amount, 0);

        return {
            name: project.name,
            company: project.company,
            implementation,
            maintenance,
            total: implementation + maintenance
        };
    }).filter(p => p.total > 0)
        .sort((a, b) => b.total - a.total);

    return (
        <div className="space-y-8">
            {/* Main Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-sm text-slate-400">Implementación Total</span>
                    </div>
                    <p className="text-3xl font-bold text-white">${totalImplementation.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Todos los proyectos</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                            <Calendar size={24} />
                        </div>
                        <span className="text-sm text-slate-400">MRR Total</span>
                    </div>
                    <p className="text-3xl font-bold text-white">${totalMRR.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Ingresos mensuales consolidados</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-sm text-slate-400">ARR Total</span>
                    </div>
                    <p className="text-3xl font-bold text-white">${totalARR.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Proyección anual consolidada</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                            <BarChart3 size={24} />
                        </div>
                        <span className="text-sm text-slate-400">Total General</span>
                    </div>
                    <p className="text-3xl font-bold text-white">${grandTotal.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Suma de todos los ingresos</p>
                </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Desglose Consolidado</h3>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-400">Implementación</span>
                            <span className="text-sm font-medium text-white">
                                ${totalImplementation.toLocaleString()} ({grandTotal > 0 ? Math.round((totalImplementation / grandTotal) * 100) : 0}%)
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${grandTotal > 0 ? (totalImplementation / grandTotal) * 100 : 0}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-400">Mantenimiento Mensual</span>
                            <span className="text-sm font-medium text-white">
                                ${totalMRR.toLocaleString()} ({grandTotal > 0 ? Math.round((totalMRR / grandTotal) * 100) : 0}%)
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${grandTotal > 0 ? (totalMRR / grandTotal) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Per-Project Breakdown */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Ingresos por Proyecto</h3>

                <div className="space-y-3">
                    {projectBreakdown.map(project => (
                        <div key={project.name} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-white">{project.name}</p>
                                    <p className="text-xs text-slate-400">{project.company}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-white">${project.total.toLocaleString()}</p>
                                <div className="flex gap-2 mt-1">
                                    {project.implementation > 0 && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                                            Impl: ${project.implementation.toLocaleString()}
                                        </span>
                                    )}
                                    {project.maintenance > 0 && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                            MRR: ${project.maintenance.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {projectBreakdown.length === 0 && (
                        <p className="text-slate-500 text-center py-8">No hay ingresos registrados aún</p>
                    )}
                </div>
            </div>
        </div>
    );
}
