'use client';

import {
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    Clock3,
    FolderKanban,
    Gauge,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';

import { StatCard } from '@/components/common/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const metrics = [
    {
        title: 'Tasks completed',
        value: '128',
        description: '+18.2% so với tuần trước',
        icon: <CheckCircle2 className="h-5 w-5" />,
        tone: 'green' as const,
    },
    {
        title: 'Average cycle time',
        value: '3.4d',
        description: 'Giảm 12% trong 30 ngày',
        icon: <Clock3 className="h-5 w-5" />,
        tone: 'blue' as const,
    },
    {
        title: 'Team throughput',
        value: '24.8',
        description: 'Task / tuần',
        icon: <TrendingUp className="h-5 w-5" />,
        tone: 'violet' as const,
    },
    {
        title: 'On-time delivery',
        value: '91%',
        description: 'Tỷ lệ giao đúng hẹn',
        icon: <Target className="h-5 w-5" />,
        tone: 'amber' as const,
    },
];

const cfdData = [
    { label: 'Mon', backlog: 42, todo: 18, doing: 16, done: 11 },
    { label: 'Tue', backlog: 40, todo: 20, doing: 17, done: 14 },
    { label: 'Wed', backlog: 36, todo: 22, doing: 18, done: 18 },
    { label: 'Thu', backlog: 32, todo: 20, doing: 22, done: 23 },
    { label: 'Fri', backlog: 28, todo: 18, doing: 19, done: 29 },
    { label: 'Sat', backlog: 22, todo: 16, doing: 17, done: 33 },
];

const workDistribution = [
    { label: 'Done', value: 48, color: 'bg-emerald-500' },
    { label: 'In progress', value: 27, color: 'bg-blue-500' },
    { label: 'To do', value: 17, color: 'bg-violet-500' },
    { label: 'Blocked', value: 8, color: 'bg-rose-500' },
];

const sprintVelocity = [
    { sprint: 'Sprint 1', value: 76 },
    { sprint: 'Sprint 2', value: 88 },
    { sprint: 'Sprint 3', value: 94 },
    { sprint: 'Sprint 4', value: 103 },
    { sprint: 'Sprint 5', value: 116 },
];

const leadTime = [
    { name: 'Lead time', value: '5.2d', change: '+0.3d' },
    { name: 'Cycle time', value: '3.4d', change: '-0.6d' },
    { name: 'WIP limit', value: '12', change: 'Healthy' },
    { name: 'Review time', value: '14h', change: '-2h' },
];

const projectHealth = [
    { name: 'Website renewal', progress: 78, done: 34, total: 43, owner: 'Nina' },
    { name: 'CRM rollout', progress: 64, done: 29, total: 45, owner: 'Alex' },
    { name: 'Mobile app', progress: 82, done: 41, total: 50, owner: 'Mai' },
];

const overall = workDistribution.reduce((sum, item) => sum + item.value, 0);

export function DashboardOverview() {
    return (
        <div className="min-h-screen bg-slate-50/40 px-4 py-6 sm:px-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 leading-none">Dashboard & Analytics</h1>
                    <p className="mt-1.5 text-sm text-slate-500">Theo dõi hiệu suất làm việc của cá nhân/team và tiến độ công việc theo thời gian</p>
                </div>
                <Button className="gap-2 bg-blue-600 font-semibold text-white hover:bg-blue-700 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm">
                    <BarChart3 className="h-4 w-4" />
                    Xuất báo cáo
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                    <StatCard
                        key={metric.title}
                        title={metric.title}
                        value={metric.value}
                        description={metric.description}
                        icon={metric.icon}
                        tone={metric.tone}
                    />
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
                <Card className="border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Cumulative Flow Diagram</CardTitle>
                                <CardDescription className="mt-1 text-sm text-slate-500">Luồng công việc tích lũy theo thời gian</CardDescription>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                <TrendingUp className="h-3.5 w-3.5" />
                                +12.4%
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-6 gap-3 border-b border-slate-100 pb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <span>Day</span>
                            <span>Backlog</span>
                            <span>To do</span>
                            <span>Doing</span>
                            <span>Done</span>
                            <span>Flow</span>
                        </div>

                        <div className="mt-4 space-y-4">
                            {cfdData.map((row) => (
                                <div key={row.label} className="grid grid-cols-6 items-center gap-3 text-sm font-medium text-slate-600 hover:bg-slate-50 p-1.5 -mx-1.5 rounded-lg transition-colors cursor-default">
                                    <span className="font-bold text-slate-900">{row.label}</span>
                                    <span>{row.backlog}</span>
                                    <span>{row.todo}</span>
                                    <span>{row.doing}</span>
                                    <span>{row.done}</span>
                                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div className="w-[30%] bg-violet-500" />
                                        <div className="w-[25%] bg-blue-500" />
                                        <div className="w-[20%] bg-amber-500" />
                                        <div className="w-[25%] bg-emerald-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold text-slate-900">Task distribution</CardTitle>
                        <CardDescription className="text-sm text-slate-500">Phân bổ công việc hiện tại</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                        <div className="flex items-center justify-center py-2">
                            <div
                                className="relative flex h-40 w-40 items-center justify-center rounded-full shadow-inner"
                                style={{
                                    background: `conic-gradient(#10b981 0 48%, #3b82f6 48% 75%, #8b5cf6 75% 92%, #f43f5e 92% 100%)`,
                                }}
                            >
                                <div className="flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
                                    <span className="text-2xl font-bold text-slate-900">{overall}%</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Load</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {workDistribution.map((item) => (
                                <div key={item.label} className="group space-y-1.5">
                                    <div className="flex items-center justify-between text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <span className={`h-3 w-3 rounded-full ${item.color} shadow-sm`} />
                                            {item.label}
                                        </span>
                                        <span className="font-bold">{item.value}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                        <div className={`h-full rounded-full ${item.color} transition-all duration-500 group-hover:opacity-80`} style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Team velocity</CardTitle>
                                <CardDescription className="mt-1 text-sm text-slate-500">Năng suất theo sprint</CardDescription>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md font-semibold text-sm">
                                <ArrowUpRight className="h-4 w-4" />
                                <span>+23%</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex h-52 items-end gap-4 pb-2">
                            {sprintVelocity.map((item) => (
                                <div key={item.sprint} className="group flex flex-1 flex-col items-center gap-2 h-full cursor-default">
                                    <div className="flex h-full w-full items-end justify-center relative">
                                        <div
                                            className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-lg group-hover:-translate-y-1"
                                            style={{ height: `${Math.max(item.value, 20)}%` }}
                                            title={`${item.value} points`}
                                        />
                                        <div className="absolute bottom-[calc(100%+4px)] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-10" style={{ bottom: `calc(${Math.max(item.value, 20)}% + 8px)` }}>
                                            {item.value} pts
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-500">{item.sprint}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold text-slate-900">Lead / Cycle time</CardTitle>
                        <CardDescription className="text-sm text-slate-500">Đo lường thời gian hoàn thành</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                        {leadTime.map((item) => (
                            <div key={item.name} className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-blue-50/50 hover:border-blue-100 transition-colors cursor-default">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-900 transition-colors">{item.name}</p>
                                    <p className="text-xs font-medium text-slate-400 mt-0.5 group-hover:text-blue-600/70 transition-colors">{item.change}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-bold text-blue-600 group-hover:scale-110 transition-transform origin-right">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900">Project health overview</CardTitle>
                            <CardDescription className="mt-1 text-sm text-slate-500">Tình trạng các dự án đang chạy</CardDescription>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            <FolderKanban className="h-4 w-4" />
                            3 active projects
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid gap-4 md:grid-cols-3">
                        {projectHealth.map((project) => (
                            <div key={project.name} className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">{project.name}</p>
                                            <p className="mt-1 text-xs font-medium text-slate-500">Owner: <span className="text-slate-700">{project.owner}</span></p>
                                        </div>
                                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-100">
                                            <Gauge className="h-3 w-3" />
                                            {project.progress}%
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500 opacity-90 group-hover:opacity-100 transition-opacity"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>

                                    <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-slate-500 transition-colors">
                                        <span>{project.done} completed</span>
                                        <span>{project.total} total tasks</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3 pb-6">
                <Card className="group border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="flex items-center justify-between gap-3 p-5">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">Daily focus</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">7.8h</p>
                        </div>
                        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <Users className="h-7 w-7" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="group border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="flex items-center justify-between gap-3 p-5">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors">Avg. throughput</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">18 <span className="text-base text-slate-400 font-medium">/ day</span></p>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <TrendingUp className="h-7 w-7" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="group border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-rose-300 hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="flex items-center justify-between gap-3 p-5">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 group-hover:text-rose-600 transition-colors">Blocked items</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">6</p>
                        </div>
                        <div className="rounded-2xl bg-rose-50 p-3 text-rose-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <CheckCircle2 className="h-7 w-7" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
