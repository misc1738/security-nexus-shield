
export interface ThreatIntelligence {
  id: string;
  threatType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  ioc: string; // Indicator of Compromise
  description: string;
  source: string;
  timestamp: string;
  confidence: number;
}

export interface ThreatFeed {
  malwareHashes: string[];
  suspiciousIPs: string[];
  maliciousDomains: string[];
  lastUpdated: string;
}

class ThreatIntelligenceService {
  private static instance: ThreatIntelligenceService;
  private threatFeed: ThreatFeed = {
    malwareHashes: [],
    suspiciousIPs: [],
    maliciousDomains: [],
    lastUpdated: new Date().toISOString()
  };

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): ThreatIntelligenceService {
    if (!ThreatIntelligenceService.instance) {
      ThreatIntelligenceService.instance = new ThreatIntelligenceService();
    }
    return ThreatIntelligenceService.instance;
  }

  private initializeMockData() {
    // Mock threat intelligence data
    this.threatFeed = {
      malwareHashes: [
        'a1b2c3d4e5f6789012345678901234567890abcd',
        'e5f6789012345678901234567890abcda1b2c3d4',
        '789012345678901234567890abcda1b2c3d4e5f6'
      ],
      suspiciousIPs: [
        '192.168.1.100',
        '10.0.0.45',
        '172.16.0.99'
      ],
      maliciousDomains: [
        'malicious-site.example.com',
        'phishing-domain.net',
        'suspicious-url.org'
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  async fetchLatestThreats(): Promise<ThreatIntelligence[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        threatType: 'Malware Hash',
        severity: 'high',
        ioc: 'a1b2c3d4e5f6789012345678901234567890abcd',
        description: 'Known Trojan.GenKrypter variant detected in wild',
        source: 'VirusTotal',
        timestamp: new Date().toISOString(),
        confidence: 95
      },
      {
        id: '2',
        threatType: 'Suspicious IP',
        severity: 'medium',
        ioc: '192.168.1.100',
        description: 'C2 server communication detected',
        source: 'Internal Analysis',
        timestamp: new Date().toISOString(),
        confidence: 87
      }
    ];
  }

  getThreatFeed(): ThreatFeed {
    return this.threatFeed;
  }

  checkHash(hash: string): boolean {
    return this.threatFeed.malwareHashes.includes(hash);
  }

  checkIP(ip: string): boolean {
    return this.threatFeed.suspiciousIPs.includes(ip);
  }

  checkDomain(domain: string): boolean {
    return this.threatFeed.maliciousDomains.includes(domain);
  }
}

export default ThreatIntelligenceService;
