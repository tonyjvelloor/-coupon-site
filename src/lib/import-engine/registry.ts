import { AffiliateConnector } from './types';
import * as fs from 'fs';
import * as path from 'path';

export class ConnectorRegistry {
  private connectors = new Map<string, AffiliateConnector>();


  register(connector: AffiliateConnector) {
    const id = connector.id || (connector as any).sourceId;
    if (!id) {
      throw new Error(`Connector missing id or sourceId: ${JSON.stringify(connector)}`);
    }
    this.connectors.set(id.toLowerCase(), connector);
  }

  get(id: string): AffiliateConnector {
    const connector = this.connectors.get(id.toLowerCase());
    if (!connector) {
      throw new Error(`Connector not found for id: ${id}`);
    }
    return connector;
  }

  list(): AffiliateConnector[] {
    return Array.from(this.connectors.values());
  }
}

// Singleton registry for the application
export const connectorRegistry = new ConnectorRegistry();
