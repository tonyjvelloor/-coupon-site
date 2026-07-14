import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectorRegistry } from "@/lib/import-engine/registry";
import { ImpactConnector } from "@/lib/import-engine/connectors/impact";
import { CJConnector } from "@/lib/import-engine/connectors/cj";
import { CuelinksConnector } from "@/lib/import-engine/connectors/cuelinks-connector";

// Register available connectors. In a real app this would happen at app boot.
const isDev = process.env.NODE_ENV !== "production";
connectorRegistry.register(new ImpactConnector(isDev));
connectorRegistry.register(new CJConnector(isDev));
connectorRegistry.register(new CuelinksConnector());

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connectors = connectorRegistry.list();
  const statuses = [];

  for (const connector of connectors) {
    // In a production scenario, we'd query the DB for the last ImportJob for this connector
    // and perhaps ping the connector if it has a health() method.
    // For now, we return a mocked successful status representing the connector's readiness.
    statuses.push({
      connector: connector.sourceId,
      name: connector.name,
      capabilities: connector.capabilities,
      connectorVersion: connector.connectorVersion,
      apiVersion: connector.apiVersion,
      status: "healthy",
      lastSuccessfulImport: "N/A", // Could be fetched from prisma.importJob
      lastFailure: null,
      apiReachable: true // Assuming true for now
    });
  }

  return NextResponse.json({ connectors: statuses });
}
