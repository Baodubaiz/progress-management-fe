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

import { PageHeader } from '@/components/common/page-header';
import { StatCard } from '@/components/common/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const metrics = [
    {
        title: 'Tasks completed',
        value: '128',
        description: '+18.2% so với tuần trước',
        icon: <CheckCircle2 className="h-4 w-4" />,
        tone: 'green' as const,
    },
    {
        title: 'Average cycle time',
        value: '3.4d',
        description: 'Giảm 12% trong 30 ngày',
        icon: <Clock3 className="h-4 w-4" />,
        tone: 'blue' as const,
    },
    {
        title: 'Team throughput',
        value: '24.8',
        description: 'Task / tuần',
        icon: <TrendingUp className="h-4 w-4" />,
        tone: 'violet' as const,
    },
    {
        title: 'On-time delivery',
        value: '91%',
        description: 'Tỷ lệ giao đúng hẹn',
        icon: <Target className="h-4 w-4" />,
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
        <div className="space-y-6">
            <PageHeader
                title="Dashboard & Analytics"
                description="Theo dõi hiệu suất làm việc của cá nhân/team và tiến độ công việc theo thời gian"
                action={
                    <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-500">
                        <BarChart3 className="h-4 w-4" />
                        Export report
                    </Button>
                }
            />

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
                <Card className="border border-white/10 bg-slate-950/25 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-lg text-white">Cumulative Flow Diagram</CardTitle>
                                <CardDescription className="mt-1 text-slate-300">Luồng công việc tích lũy theo thời gian</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                                <TrendingUp className="h-3.5 w-3.5" />
                                +12.4%
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-6 gap-3 border-b border-white/10 pb-3 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                            <span>Day</span>
                            <span>Backlog</span>
                            <span>To do</span>
                            <span>Doing</span>
                            <span>Done</span>
                            <span>Flow</span>
                        </div>

                        <div className="mt-4 space-y-3">
                            {cfdData.map((row) => (
                                <div key={row.label} className="grid grid-cols-6 items-center gap-3 text-sm text-slate-200">
                                    <span className="font-medium text-white">{row.label}</span>
                                    <span>{row.backlog}</span>
                                    <span>{row.todo}</span>
                                    <span>{row.doing}</span>
                                    <span>{row.done}</span>
                                    <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-800">
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

                <Card className="border border-white/10 bg-slate-950/25 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-white">Task distribution</CardTitle>
                        <CardDescription className="text-slate-300">Phân bổ công việc hiện tại</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-0">
                        <div className="flex items-center justify-center">
                            <div
                                className="relative flex h-40 w-40 items-center justify-center rounded-full"
                                style={{
                                    background: `conic-gradient(#10b981 0 48%, #3b82f6 48% 75%, #8b5cf6 75% 92%, #f43f5e 92% 100%)`,
                                }}
                            >
                                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-slate-950 text-center">
                                    <span className="text-lg font-bold text-white">{overall}%</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Load</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {workDistribution.map((item) => (
                                <div key={item.label} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm text-slate-200">
                                        <span className="flex items-center gap-2">
                                            <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                            {item.label}
                                        </span>
                                        <span>{item.value}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-800">
                                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="border border-white/10 bg-slate-950/25 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-lg text-white">Team velocity</CardTitle>
                                <CardDescription className="mt-1 text-slate-300">Năng suất theo sprint</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-300">
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="text-sm font-medium">+23%</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex h-52 items-end gap-3">
                            {sprintVelocity.map((item) => (
                                <div key={item.sprint} className="flex flex-1 flex-col items-center gap-2">
                                    <div className="flex h-full w-full items-end justify-center">
                                        <div
                                            className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400"
                                            style={{ height: `${Math.max(item.value, 20)}%` }}
                                            title={`${item.value} points`}
                                        />
                                    </div>
                                    <span className="text-[11px] text-slate-400">{item.sprint}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-white/10 bg-slate-950/25 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-white">Lead / Cycle time</CardTitle>
                        <CardDescription className="text-slate-300">Đo lường thời gian hoàn thành</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                        {leadTime.map((item) => (
                            <div key={item.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/35 px-3 py-2.5">
                                <div>
                                    <p className="text-sm font-medium text-white">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.change}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-bold text-blue-300">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-white/10 bg-slate-950/25 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-lg text-white">Project health overview</CardTitle>
                            <CardDescription className="mt-1 text-slate-300">Tình trạng các dự án đang chạy</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-200">
                            <FolderKanban className="h-3.5 w-3.5" />
                            3 active projects
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-4">
                        {projectHealth.map((project) => (
                            <div key={project.name} className="rounded-2xl border border-white/10 bg-slate-900/35 p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-base font-semibold text-white">{project.name}</p>
                                        <p className="mt-1 text-sm text-slate-300">Owner: {project.owner}</p>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
                                        <Gauge className="h-3.5 w-3.5" />
                                        {project.progress}% complete
                                    </div>
                                </div>

                                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>

                                <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                                    <span>{project.done} completed</span>
                                    <span>{project.total} total tasks</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border border-white/10 bg-slate-950/25 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                        <div>
                            <p className="text-sm text-slate-300">Daily focus</p>
                            <p className="mt-1 text-xl font-bold text-white">7.8h</p>
                        </div>
                        <Users className="h-8 w-8 rounded-xl bg-blue-500/10 p-2 text-blue-300" />
                    </CardContent>
                </Card>

                <Card className="border border-white/10 bg-slate-950/25 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                        <div>
                            <p className="text-sm text-slate-300">Avg. throughput</p>
                            <p className="mt-1 text-xl font-bold text-white">18 / day</p>
                        </div>
                        <TrendingUp className="h-8 w-8 rounded-xl bg-emerald-500/10 p-2 text-emerald-300" />
                    </CardContent>
                </Card>

                <Card className="border border-white/10 bg-slate-950/25 shadow-xl shadow-slate-950/20 backdrop-blur-sm">
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                        <div>
                            <p className="text-sm text-slate-300">Blocked items</p>
                            <p className="mt-1 text-xl font-bold text-white">6</p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 rounded-xl bg-rose-500/10 p-2 text-rose-300" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
