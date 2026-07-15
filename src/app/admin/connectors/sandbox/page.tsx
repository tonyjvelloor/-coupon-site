"use client";

import { useState } from "react";

export default function ConnectorSandboxPage() {
    const [connector, setConnector] = useState("inrdeals");
    const [payload, setPayload] = useState("{}");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        try {
            // In a real implementation, this would call a server action or API route
            // which executes the specific connector's normalize() + rules + resolver on the payload
            // For now, we simulate the output.
            
            const parsed = JSON.parse(payload);
            setResult({
                status: "success",
                normalized: {
                    merchantName: parsed.store_name || "Extracted Name",
                    title: parsed.title || "Extracted Title",
                    qualityScore: 85
                },
                resolution: {
                    action: "MATCHED",
                    canonicalId: "some-uuid"
                }
            });
        } catch (e: any) {
            setResult({ status: "error", message: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto grid grid-cols-2 gap-8">
            <div>
                <h1 className="text-3xl font-bold mb-6">Connector Sandbox</h1>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Connector</label>
                    <select 
                        value={connector} 
                        onChange={e => setConnector(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="inrdeals">INRDeals</option>
                        <option value="cuelinks">Cuelinks</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Raw JSON Payload</label>
                    <textarea 
                        value={payload}
                        onChange={e => setPayload(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-md font-mono text-sm h-64"
                        placeholder="Paste JSON payload here..."
                    />
                </div>

                <button 
                    onClick={handleRun}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? "Running..." : "Run Pipeline"}
                </button>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6">Pipeline Output</h2>
                {result ? (
                    <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm shadow-xl h-full max-h-[80vh]">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                ) : (
                    <div className="h-64 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 rounded-lg">
                        Run the pipeline to see output
                    </div>
                )}
            </div>
        </div>
    );
}
