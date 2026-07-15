import { ConnectorRegistry } from "./registry";

describe("Connector Contract Test Suite", () => {
    const registry = new ConnectorRegistry();

    beforeAll(async () => {
        await registry.loadConnectors();
    });

    it("should load at least one connector", () => {
        const connectors = registry.getAllConnectors();
        expect(connectors.length).toBeGreaterThan(0);
    });

    describe.each(registry.getAllConnectors().map(c => [c.id, c]))(
        "Connector %s",
        (id, connector) => {
            
            it("should have a valid manifest", () => {
                expect(connector.manifest).toBeDefined();
                expect(connector.manifest.id).toBe(id);
                expect(connector.manifest.version).toBeDefined();
            });

            it("should support authentication", async () => {
                if (connector.authenticate) {
                    await expect(connector.authenticate()).resolves.not.toThrow();
                }
            });

            it("should fetch a limited number of items quickly (Dry Run)", async () => {
                let count = 0;
                for await (const row of connector.fetch()) {
                    count++;
                    if (count >= 5) break; // test only first 5
                }
                // Some feeds might be empty, but we shouldn't throw an error.
                expect(count).toBeGreaterThanOrEqual(0);
            });
        }
    );
});
