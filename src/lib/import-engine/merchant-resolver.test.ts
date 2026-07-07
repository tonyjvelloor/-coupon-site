import { MerchantResolver } from './merchant-resolver';

describe('MerchantResolver Normalization', () => {
  it('should lowercase strings', () => {
    expect(MerchantResolver.normalize('Amazon')).toBe('amazon');
    expect(MerchantResolver.normalize('AMAZON')).toBe('amazon');
  });

  it('should remove punctuation', () => {
    expect(MerchantResolver.normalize('Amazon, Inc.')).toBe('amazon inc');
    expect(MerchantResolver.normalize('Target-Store!')).toBe('target store');
  });

  it('should replace multiple spaces with single space', () => {
    expect(MerchantResolver.normalize('Amazon   India')).toBe('amazon india');
  });

  it('should strip common legal suffixes', () => {
    expect(MerchantResolver.normalize('Amazon India Pvt. Ltd.')).toBe('amazon india');
    expect(MerchantResolver.normalize('Myntra Designs Private Limited')).toBe('myntra designs');
    expect(MerchantResolver.normalize('Apple Inc.')).toBe('apple');
    expect(MerchantResolver.normalize('Google LLC')).toBe('google');
  });
});

describe('MerchantResolver Domain Normalization', () => {
  it('should extract root domain from URL', () => {
    expect(MerchantResolver.normalizeDomain('https://www.amazon.in/foo/bar')).toBe('amazon.in');
    expect(MerchantResolver.normalizeDomain('http://flipkart.com')).toBe('flipkart.com');
  });

  it('should handle raw domains', () => {
    expect(MerchantResolver.normalizeDomain('amazon.in')).toBe('amazon.in');
    expect(MerchantResolver.normalizeDomain('www.target.com')).toBe('target.com');
  });
});

// Since the DB requires mocking or an integration environment, 
// we will focus our static unit tests on the string manipulation logic 
// that drives the fuzzy match engine. 
