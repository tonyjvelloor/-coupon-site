import { prisma } from "@/lib/db";
import { ShieldAlert, AlertTriangle, CheckCircle, Activity, BrainCircuit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

async function getMissionBoardOpportunities() {
    const opportunities = await prisma.opportunity.findMany({
        where: { status: "GENERATED" },
        orderBy: { confidence: "desc" },
        take: 20,
    });
    return opportunities;
}

export default async function AdminDashboard() {
    const opportunities = await getMissionBoardOpportunities();
    let strategies = await prisma.strategy.findMany({
        include: { conditions: true },
        orderBy: { confidence: 'desc' }
    });
    
    // Fallback for visual demonstration if DB is empty
    if (strategies.length === 0) {
        strategies = [
            {
                id: "mock1",
                conditions: [
                    { field: 'categorySlugs', operator: 'includes', value: 'electronics' },
                    { field: 'merchantSize', operator: '=', value: 'LARGE' }
                ] as any,
                action: "Publish FAQ",
                averageImpact: { ctr: "+18%", revenue: "+11%" } as any,
                timesApplied: 42,
                positiveOutcomes: 36,
                negativeOutcomes: 4,
                neutralOutcomes: 2,
                lastObserved: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
                confidence: 96,
                validatedAt: null,
                expiresAt: null,
                isActive: true,
                status: "STABLE",
                version: 1,
                previousVersionId: null,
                explanation: "FAQ increased CTR on comparable merchants.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "mock2",
                conditions: [
                    { field: 'merchantSize', operator: '=', value: 'LARGE' },
                    { field: 'authority', operator: '>', value: '80' }
                ] as any,
                action: "Publish Buying Guide",
                averageImpact: { revenue: "+14%" } as any,
                timesApplied: 8,
                positiveOutcomes: 6,
                negativeOutcomes: 1,
                neutralOutcomes: 1,
                lastObserved: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
                confidence: 85,
                validatedAt: null,
                expiresAt: null,
                isActive: true,
                status: "EMERGING",
                version: 1,
                previousVersionId: null,
                explanation: "High-authority merchants see revenue bumps from guides.",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
    }

    const critical = opportunities.slice(0, 3);
    const high = opportunities.slice(3, 8);

    const proven = strategies.filter(s => s.status === 'STABLE' || s.status === 'CONFIRMED');
    const emerging = strategies.filter(s => s.status === 'EMERGING');
    const declining = strategies.filter(s => s.status === 'DECLINING' || s.status === 'UNDER_REVIEW');
    const retired = strategies.filter(s => s.status === 'RETIRED');

    const renderStrategy = (l: any) => {
        const conditions = l.conditions as any[];
        const impact = l.averageImpact as Record<string, any>;
        const appliesTo = conditions?.map(c => `${c.field} ${c.operator} ${c.value}`).join(', ') || 'Any';
        const impactStr = Object.entries(impact || {}).map(([k, v]) => `${k.toUpperCase()} ${v}`).join(', ');
        
        const successRate = l.timesApplied > 0 ? Math.round((l.positiveOutcomes / l.timesApplied) * 100) : 0;
        const lastValidated = formatDistanceToNow(new Date(l.lastObserved), { addSuffix: true });

        return (
            <div key={l.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow mb-4">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-bold text-gray-900">{l.action}</h4>
                    <span className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded text-gray-500 border border-gray-200">
                        v{l.version}
                    </span>
                </div>
                
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3 border-b border-gray-100 pb-1">
                    Why should I trust this strategy?
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p className="text-gray-500 text-xs">Confidence</p>
                        <p className="font-bold text-gray-900">{l.confidence}%</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Success Rate</p>
                        <p className="font-bold text-emerald-600">{successRate}%</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Evidence</p>
                        <p className="font-medium text-gray-900">{l.timesApplied} merchants</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs">Avg Impact</p>
                        <p className="font-medium text-indigo-600">{impactStr}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2 mb-3">
                    <p className="text-gray-600">
                        <span className="font-medium text-gray-900">Applies to:</span> {appliesTo}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium text-gray-900">Last validated:</span> {lastValidated}
                    </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
                    <span>Status: {l.status}</span>
                    <span className="flex gap-2">
                        <span>Pos: {l.positiveOutcomes}</span>
                        <span>Neg: {l.negativeOutcomes}</span>
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="pt-2 max-w-[1600px] mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Commerce Decision Platform</h1>
                    <p className="text-gray-500 mt-2 text-lg">One screen. Five minutes. Everything.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* 1. TODAY (Mission Board) - 5 Cols */}
                <div className="xl:col-span-5 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 border-gray-200">TODAY</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-red-600" />
                            <h3 className="font-bold text-gray-900">CRITICAL</h3>
                        </div>
                        {critical.map((opp) => (
                            <OpportunityCard key={opp.id} opportunity={opp} level="critical" />
                        ))}
                        {critical.length === 0 && <EmptyState />}
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <h3 className="font-bold text-gray-900">HIGH</h3>
                        </div>
                        {high.map((opp) => (
                            <OpportunityCard key={opp.id} opportunity={opp} level="high" />
                        ))}
                        {high.length === 0 && <EmptyState />}
                    </div>
                </div>

                {/* 2. MERCHANT HEALTH - 4 Cols */}
                <div className="xl:col-span-4 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 border-gray-200">MERCHANT HEALTH</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <ExplainableMetricCard 
                            title="System Authority" 
                            score={88} 
                            reasons={["Coverage +28", "Freshness +15", "Trust +20", "Internal Links +12", "Revenue +13"]} 
                        />
                        <ExplainableMetricCard 
                            title="Global Coverage" 
                            score={92} 
                            reasons={["Active Offers +14", "Policies +14", "Buying Guides +8", "Timeline +14", "Trust Signals +14"]} 
                        />
                        <ExplainableMetricCard 
                            title="Knowledge Confidence" 
                            score={85} 
                            reasons={["Human Authored +15", "Editor Verified +15", "Data is Current -5"]} 
                        />
                    </div>
                    
                    <h2 className="text-xl font-bold border-b pb-2 border-gray-200 mt-8">BUSINESS</h2>
                    <div className="space-y-4">
                        <BusinessMetric title="RPIP" value="$0.14" trend="+12%" />
                        <BusinessMetric title="RPKA" value="$4.22" trend="+8%" />
                        <BusinessMetric title="Knowledge Growth" value="1,204" trend="+45/day" />
                        <BusinessMetric title="Revenue Impact" value="$12,450" trend="Estimated" />
                    </div>
                </div>

                {/* 3. INTELLIGENCE STRATEGIES - 3 Cols */}
                <div className="xl:col-span-3 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 border-gray-200 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-indigo-600" />
                        STRATEGY ENGINE
                    </h2>
                    
                    {proven.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-3">Proven Strategies</h3>
                            {proven.map(renderStrategy)}
                        </div>
                    )}
                    
                    {emerging.length > 0 && (
                        <div className="space-y-2 mt-6">
                            <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-3">Emerging Intelligence</h3>
                            {emerging.map(renderStrategy)}
                        </div>
                    )}

                    {declining.length > 0 && (
                        <div className="space-y-2 mt-6">
                            <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-3">Patterns Losing Confidence</h3>
                            {declining.map(renderStrategy)}
                        </div>
                    )}

                    {retired.length > 0 && (
                        <div className="space-y-2 mt-6 opacity-60">
                            <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-3">Retired Knowledge</h3>
                            {retired.map(renderStrategy)}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function OpportunityCard({ opportunity, level }: { opportunity: any, level: 'critical' | 'high' | 'medium' }) {
    const colors = {
        critical: "border-red-200 bg-red-50 hover:border-red-300",
        high: "border-orange-200 bg-orange-50 hover:border-orange-300",
        medium: "border-blue-200 bg-blue-50 hover:border-blue-300"
    };

    const snapshot = typeof opportunity.inputSnapshot === 'string' ? JSON.parse(opportunity.inputSnapshot) : opportunity.inputSnapshot;
    const bd = snapshot?.strategyBreakdown;

    return (
        <div className={`p-4 rounded-xl border ${colors[level]} transition-colors group`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{opportunity.title}</h3>
                <span className="text-xs font-mono bg-white px-2 py-1 rounded text-gray-600 border border-gray-100 shadow-sm">
                    {opportunity.type}
                </span>
            </div>
            
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap leading-relaxed">
                {opportunity.reasoning}
            </p>
            
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100/50 shadow-sm">
                <p className="text-sm font-medium text-gray-900">{opportunity.recommendation}</p>
            </div>

            {bd && (
                <div className="mt-3 bg-white rounded border border-gray-200 p-2 flex gap-3 text-xs items-center justify-between shadow-sm">
                    <span className="font-semibold text-gray-900">Score: {bd.score}</span>
                    <div className="flex gap-2 text-gray-500">
                        <span title="Similarity">Sim: {bd.similarity}</span>
                        <span title="Evidence">Ev: {bd.evidence}</span>
                        <span title="Freshness">Fr: {bd.freshness}</span>
                        <span title="Confidence">Conf: {bd.confidence}</span>
                    </div>
                </div>
            )}

            <div className="mt-4 flex items-center gap-3">
                <button className="flex-1 bg-white border border-gray-200 rounded-lg py-2 text-xs font-bold hover:bg-gray-50 flex justify-center items-center gap-1.5 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    APPROVE DECISION
                </button>
            </div>
        </div>
    );
}

function ExplainableMetricCard({ title, score, reasons }: { title: string, score: number, reasons: string[] }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 font-medium">{title}</h3>
                <span className="text-2xl font-black text-gray-900">{score}</span>
            </div>
            <div className="space-y-1">
                <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Explainability Log</p>
                {reasons.map((r, i) => (
                    <div key={i} className="flex items-center text-xs text-gray-600 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></span>
                        {r}
                    </div>
                ))}
            </div>
        </div>
    );
}

function BusinessMetric({ title, value, trend }: { title: string, value: string, trend: string }) {
    return (
        <div className="bg-gray-900 rounded-xl p-5 text-white shadow-lg">
            <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{value}</span>
                <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    {trend}
                </span>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
            <p className="text-gray-500 text-sm">No tasks in this queue</p>
        </div>
    );
}
