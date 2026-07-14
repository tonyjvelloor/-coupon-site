import { prisma } from "@/lib/db";
import { ShieldAlert, AlertTriangle, CheckCircle, Activity } from "lucide-react";

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

    const critical = opportunities.slice(0, 3);
    const high = opportunities.slice(3, 8);

    return (
        <div className="pt-2 max-w-[1600px] mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Commerce OS</h1>
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
                </div>

                {/* 3. BUSINESS - 3 Cols */}
                <div className="xl:col-span-3 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 border-gray-200">BUSINESS</h2>
                    <div className="space-y-4">
                        <BusinessMetric title="RPIP" value="$0.14" trend="+12%" />
                        <BusinessMetric title="RPKA" value="$4.22" trend="+8%" />
                        <BusinessMetric title="Knowledge Growth" value="1,204" trend="+45/day" />
                        <BusinessMetric title="Revenue Impact" value="$12,450" trend="Estimated" />
                    </div>
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

    return (
        <div className={`p-4 rounded-xl border ${colors[level]} transition-colors group`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{opportunity.title}</h3>
                <span className="text-xs font-mono bg-white px-2 py-1 rounded text-gray-600 border border-gray-100 shadow-sm">
                    {opportunity.type}
                </span>
            </div>
            
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                {opportunity.reasoning}
            </p>
            
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100/50 shadow-sm">
                <p className="text-sm font-medium text-gray-900">{opportunity.recommendation}</p>
            </div>

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
