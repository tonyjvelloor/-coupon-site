import { AffiliateConnector } from './types';

export class ConnectorRegistry {
  private connectors = new Map<string, AffiliateConnector>();

  register(connector: AffiliateConnector) {
    this.connectors.set(connector.sourceId.toLowerCase(), connector);
  }

  get(sourceId: string): AffiliateConnector {
    const connector = this.connectors.get(sourceId.toLowerCase());
    if (!connector) {
      throw new Error(`Connector not found for sourceId: ${sourceId}`);
    }
    return connector;
  }

  list(): AffiliateConnector[] {
    return Array.from(this.connectors.values());
  }
}

// Singleton registry for the application
export const connectorRegistry = new ConnectorRegistry();
