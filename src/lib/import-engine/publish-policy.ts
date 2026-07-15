export interface PublishPolicy {
  qualityScore: number;
  connectorTrust: number;
  duplicateRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  expiryRequired: boolean;
}

export const defaultPublishPolicy: PublishPolicy = {
  qualityScore: 90,
  connectorTrust: 95,
  duplicateRisk: 'LOW',
  expiryRequired: false,
};

export const connectorTrustLevels: Record<string, number> = {
  'cuelinks': 95,
  'impact': 99,
  'cj': 98,
  'csv_upload': 40,
  'manual': 100
};

export function evaluateAutoPublish(
  qualityScore: number,
  connectorId: string,
  duplicateRiskScore: number
): boolean {
  const trust = connectorTrustLevels[connectorId] || 0;
  
  const risk = duplicateRiskScore >= 90 ? 'HIGH' : duplicateRiskScore >= 50 ? 'MEDIUM' : 'LOW';

  if (trust >= defaultPublishPolicy.connectorTrust &&
      qualityScore >= defaultPublishPolicy.qualityScore &&
      risk === defaultPublishPolicy.duplicateRisk) {
    return true;
  }
  return false;
}
