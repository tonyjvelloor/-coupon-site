import { parse } from "csv-parse";
import { AffiliateConnector, NormalizedOffer, ValidationError } from "../types";

export class CsvConnector implements AffiliateConnector {
  readonly sourceId = "csv";
  private csvData: string;

  constructor(csvData: string) {
    this.csvData = csvData;
  }

  async connect(): Promise<void> {
    // No connection necessary for a static CSV string buffer.
  }

  async *fetch(): AsyncGenerator<any, void, unknown> {
    const parser = parse(this.csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    for await (const record of parser) {
      yield record;
    }
  }

  normalize(rawData: any): NormalizedOffer {
    // Basic mapping: assumes headers loosely match our needs, or handles variations.
    return {
      merchantName: rawData.merchant || rawData.store || rawData.merchantName || "Unknown Merchant",
      title: rawData.title || rawData.offer || rawData.name || "Untitled Offer",
      description: rawData.description || rawData.desc,
      code: rawData.code || rawData.couponCode,
      destinationUrl: rawData.destinationUrl || rawData.url || rawData.link || "",
      affiliateUrl: rawData.affiliateUrl || rawData.trackingLink || rawData.destinationUrl || "", // Fallback
      discountType: (rawData.discountType?.toLowerCase() as any) || "flat",
      discountValue: rawData.discountValue || rawData.discount,
      expiry: rawData.expiry || rawData.expiresAt || rawData.endDate ? new Date(rawData.expiry || rawData.expiresAt || rawData.endDate) : undefined,
      category: rawData.category,
      source: this.sourceId,
      externalId: rawData.id || rawData.externalId || rawData.offerId
    };
  }

  validate(normalized: NormalizedOffer): ValidationError[] {
    const errors: ValidationError[] = [];

    // Basic structural checks that a connector should care about before engine rules
    if (!normalized.merchantName || normalized.merchantName === "Unknown Merchant") {
      errors.push({
        field: "merchantName",
        severity: "error",
        code: "CSV_MISSING_MERCHANT",
        message: "CSV row is missing a merchant or store identifier."
      });
    }

    return errors;
  }

  async disconnect(): Promise<void> {
    // No cleanup required.
  }
}
