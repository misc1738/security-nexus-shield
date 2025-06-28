interface ForensicEvidence {
  id: string;
  type: 'file' | 'memory' | 'network' | 'registry' | 'log';
  name: string;
  path: string;
  hash: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
  metadata: Record<string, any>;
  tags: string[];
  chainOfCustody: ChainOfCustodyEntry[];
}

interface ChainOfCustodyEntry {
  id: string;
  action: 'collected' | 'analyzed' | 'transferred' | 'stored';
  timestamp: string;
  user: string;
  description: string;
  signature: string;
}

interface ForensicCase {
  id: string;
  name: string;
  description: string;
  status: 'open' | 'analyzing' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  investigator: string;
  createdAt: string;
  evidence: string[];
  timeline: ForensicEvent[];
  findings: string[];
}

interface ForensicEvent {
  id: string;
  timestamp: string;
  type: 'file_access' | 'process_execution' | 'network_connection' | 'registry_modification';
  description: string;
  source: string;
  confidence: number;
  artifacts: string[];
}

class DigitalForensicsService {
  private static instance: DigitalForensicsService;
  private cases: Map<string, ForensicCase> = new Map();
  private evidence: Map<string, ForensicEvidence> = new Map();

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): DigitalForensicsService {
    if (!DigitalForensicsService.instance) {
      DigitalForensicsService.instance = new DigitalForensicsService();
    }
    return DigitalForensicsService.instance;
  }

  private initializeMockData(): void {
    // Initialize with sample forensic cases and evidence
    const sampleCase: ForensicCase = {
      id: 'CASE-001',
      name: 'Ransomware Investigation - Finance Department',
      description: 'Investigation of ransomware attack on finance department systems',
      status: 'analyzing',
      priority: 'critical',
      investigator: 'Digital Forensics Team',
      createdAt: '2024-01-15T10:00:00Z',
      evidence: ['EVD-001', 'EVD-002'],
      timeline: [
        {
          id: 'EVT-001',
          timestamp: '2024-01-15T09:30:00Z',
          type: 'file_access',
          description: 'Suspicious executable accessed encrypted files',
          source: 'File System Analysis',
          confidence: 0.95,
          artifacts: ['malware.exe', 'encrypted_files.log']
        }
      ],
      findings: [
        'Ransomware variant identified as Conti v3',
        'Initial infection vector: phishing email',
        'Lateral movement via SMB shares detected'
      ]
    };

    this.cases.set(sampleCase.id, sampleCase);
  }

  createCase(caseData: Partial<ForensicCase>): ForensicCase {
    const newCase: ForensicCase = {
      id: `CASE-${Date.now()}`,
      name: caseData.name || 'Untitled Case',
      description: caseData.description || '',
      status: 'open',
      priority: caseData.priority || 'medium',
      investigator: caseData.investigator || 'Unknown',
      createdAt: new Date().toISOString(),
      evidence: [],
      timeline: [],
      findings: []
    };

    this.cases.set(newCase.id, newCase);
    return newCase;
  }

  addEvidence(caseId: string, evidenceData: Partial<ForensicEvidence>): ForensicEvidence {
    const evidence: ForensicEvidence = {
      id: `EVD-${Date.now()}`,
      type: evidenceData.type || 'file',
      name: evidenceData.name || 'Unknown Evidence',
      path: evidenceData.path || '',
      hash: evidenceData.hash || this.generateHash(),
      size: evidenceData.size || 0,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      metadata: evidenceData.metadata || {},
      tags: evidenceData.tags || [],
      chainOfCustody: [
        {
          id: `COC-${Date.now()}`,
          action: 'collected',
          timestamp: new Date().toISOString(),
          user: 'System',
          description: 'Evidence collected automatically',
          signature: this.generateSignature()
        }
      ]
    };

    this.evidence.set(evidence.id, evidence);

    // Add evidence to case
    const forensicCase = this.cases.get(caseId);
    if (forensicCase) {
      forensicCase.evidence.push(evidence.id);
      this.cases.set(caseId, forensicCase);
    }

    return evidence;
  }

  analyzeEvidence(evidenceId: string): Promise<any> {
    return new Promise((resolve) => {
      // Simulate forensic analysis
      setTimeout(() => {
        const analysis = {
          fileType: 'Portable Executable',
          entropy: 7.8,
          suspiciousStrings: ['CreateRemoteThread', 'VirtualAllocEx'],
          networkIndicators: ['192.168.1.100', 'malicious-domain.com'],
          behaviorAnalysis: {
            fileOperations: 45,
            registryModifications: 12,
            networkConnections: 3
          }
        };
        resolve(analysis);
      }, 2000);
    });
  }

  generateTimeline(caseId: string): ForensicEvent[] {
    const forensicCase = this.cases.get(caseId);
    if (!forensicCase) return [];

    // In a real implementation, this would analyze all evidence
    // and create a comprehensive timeline
    return forensicCase.timeline;
  }

  exportCase(caseId: string): any {
    const forensicCase = this.cases.get(caseId);
    if (!forensicCase) return null;

    const caseEvidence = forensicCase.evidence.map(id => this.evidence.get(id));

    return {
      case: forensicCase,
      evidence: caseEvidence,
      exportedAt: new Date().toISOString(),
      signature: this.generateSignature()
    };
  }

  private generateHash(): string {
    return Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private generateSignature(): string {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  getCases(): ForensicCase[] {
    return Array.from(this.cases.values());
  }

  getCase(caseId: string): ForensicCase | undefined {
    return this.cases.get(caseId);
  }

  getEvidence(evidenceId: string): ForensicEvidence | undefined {
    return this.evidence.get(evidenceId);
  }
}

export { DigitalForensicsService };
export type { ForensicCase, ForensicEvidence, ForensicEvent, ChainOfCustodyEntry };