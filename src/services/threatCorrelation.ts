
interface ThreatEvent {
  id: string;
  timestamp: string;
  type: 'malware' | 'network' | 'behavioral' | 'vulnerability' | 'phishing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceIp?: string;
  targetIp?: string;
  deviceId: string;
  userId?: string;
  processName?: string;
  fileName?: string;
  hash?: string;
  signature?: string;
  confidence: number;
  metadata: Record<string, any>;
}

interface ThreatCorrelation {
  id: string;
  events: ThreatEvent[];
  correlationType: 'temporal' | 'spatial' | 'causal' | 'behavioral';
  confidence: number;
  riskScore: number;
  description: string;
  recommendations: string[];
  createdAt: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
}

interface CorrelationRule {
  id: string;
  name: string;
  description: string;
  conditions: CorrelationCondition[];
  timeWindow: number; // seconds
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

interface CorrelationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range';
  value: any;
}

class ThreatCorrelationEngine {
  private static instance: ThreatCorrelationEngine;
  private events: ThreatEvent[] = [];
  private correlations: ThreatCorrelation[] = [];
  private rules: CorrelationRule[] = [];

  private constructor() {
    this.initializeDefaultRules();
    this.startCorrelationEngine();
  }

  static getInstance(): ThreatCorrelationEngine {
    if (!ThreatCorrelationEngine.instance) {
      ThreatCorrelationEngine.instance = new ThreatCorrelationEngine();
    }
    return ThreatCorrelationEngine.instance;
  }

  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'lateral_movement',
        name: 'Lateral Movement Detection',
        description: 'Detects potential lateral movement patterns',
        conditions: [
          { field: 'type', operator: 'equals', value: 'network' },
          { field: 'confidence', operator: 'greater_than', value: 0.7 }
        ],
        timeWindow: 300, // 5 minutes
        threshold: 3,
        severity: 'high',
        enabled: true
      },
      {
        id: 'coordinated_attack',
        name: 'Coordinated Attack Pattern',
        description: 'Identifies coordinated attacks across multiple endpoints',
        conditions: [
          { field: 'severity', operator: 'in_range', value: ['medium', 'high', 'critical'] }
        ],
        timeWindow: 600, // 10 minutes
        threshold: 5,
        severity: 'critical',
        enabled: true
      },
      {
        id: 'privilege_escalation_chain',
        name: 'Privilege Escalation Chain',
        description: 'Detects chains of privilege escalation attempts',
        conditions: [
          { field: 'type', operator: 'equals', value: 'behavioral' },
          { field: 'metadata.action', operator: 'contains', value: 'privilege' }
        ],
        timeWindow: 180, // 3 minutes
        threshold: 2,
        severity: 'high',
        enabled: true
      }
    ];
  }

  private startCorrelationEngine(): void {
    // Run correlation analysis every 30 seconds
    setInterval(() => {
      this.analyzeCorrelations();
    }, 30000);

    // Simulate incoming threat events
    setInterval(() => {
      this.simulateThreatEvent();
    }, 20000);
  }

  private simulateThreatEvent(): void {
    const types: Array<'malware' | 'network' | 'behavioral' | 'vulnerability' | 'phishing'> = 
      ['malware', 'network', 'behavioral', 'vulnerability', 'phishing'];
    
    const severities: Array<'low' | 'medium' | 'high' | 'critical'> = 
      ['low', 'medium', 'high', 'critical'];

    const event: ThreatEvent = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      sourceIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
      targetIp: `10.0.0.${Math.floor(Math.random() * 255)}`,
      deviceId: `WS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: `user${Math.floor(Math.random() * 100)}`,
      processName: ['chrome.exe', 'notepad.exe', 'powershell.exe', 'cmd.exe'][Math.floor(Math.random() * 4)],
      confidence: Math.random(),
      metadata: {
        action: Math.random() > 0.5 ? 'privilege_escalation' : 'file_access',
        protocol: Math.random() > 0.5 ? 'HTTP' : 'HTTPS',
        port: Math.floor(Math.random() * 65535)
      }
    };

    this.addEvent(event);
  }

  addEvent(event: ThreatEvent): void {
    this.events.unshift(event);
    this.events = this.events.slice(0, 1000); // Keep last 1000 events
    console.log('New threat event:', event);
  }

  private analyzeCorrelations(): void {
    this.rules.forEach(rule => {
      if (rule.enabled) {
        this.checkRule(rule);
      }
    });
  }

  private checkRule(rule: CorrelationRule): void {
    const now = new Date();
    const windowStart = new Date(now.getTime() - rule.timeWindow * 1000);

    // Get events within time window
    const recentEvents = this.events.filter(event => 
      new Date(event.timestamp) >= windowStart
    );

    // Filter events that match rule conditions
    const matchingEvents = recentEvents.filter(event => 
      this.eventMatchesConditions(event, rule.conditions)
    );

    // Check if threshold is met
    if (matchingEvents.length >= rule.threshold) {
      this.createCorrelation(rule, matchingEvents);
    }
  }

  private eventMatchesConditions(event: ThreatEvent, conditions: CorrelationCondition[]): boolean {
    return conditions.every(condition => {
      const fieldValue = this.getFieldValue(event, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        case 'in_range':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        default:
          return false;
      }
    });
  }

  private getFieldValue(event: ThreatEvent, field: string): any {
    if (field.includes('.')) {
      const parts = field.split('.');
      let value: any = event;
      for (const part of parts) {
        value = value?.[part];
      }
      return value;
    }
    return (event as any)[field];
  }

  private createCorrelation(rule: CorrelationRule, events: ThreatEvent[]): void {
    // Check if correlation already exists for these events
    const existingCorrelation = this.correlations.find(corr => 
      corr.events.some(e1 => events.some(e2 => e1.id === e2.id)) &&
      corr.status === 'active'
    );

    if (existingCorrelation) {
      return; // Don't create duplicate correlations
    }

    const correlation: ThreatCorrelation = {
      id: Date.now().toString() + Math.random(),
      events: [...events],
      correlationType: this.determineCorrelationType(events),
      confidence: this.calculateCorrelationConfidence(events),
      riskScore: this.calculateRiskScore(events, rule),
      description: this.generateCorrelationDescription(rule, events),
      recommendations: this.generateRecommendations(rule, events),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    this.correlations.unshift(correlation);
    this.correlations = this.correlations.slice(0, 50); // Keep last 50 correlations
    
    console.log('New threat correlation:', correlation);
  }

  private determineCorrelationType(events: ThreatEvent[]): 'temporal' | 'spatial' | 'causal' | 'behavioral' {
    // Simple logic to determine correlation type
    const uniqueDevices = new Set(events.map(e => e.deviceId)).size;
    const timeSpan = new Date(events[0].timestamp).getTime() - new Date(events[events.length - 1].timestamp).getTime();
    
    if (uniqueDevices > 1) return 'spatial';
    if (timeSpan < 60000) return 'temporal'; // Less than 1 minute
    if (events.some(e => e.type === 'behavioral')) return 'behavioral';
    return 'causal';
  }

  private calculateCorrelationConfidence(events: ThreatEvent[]): number {
    const avgConfidence = events.reduce((sum, e) => sum + e.confidence, 0) / events.length;
    const eventCount = events.length;
    const countBonus = Math.min(eventCount / 10, 0.3); // Bonus for more events, max 0.3
    
    return Math.min(avgConfidence + countBonus, 1);
  }

  private calculateRiskScore(events: ThreatEvent[], rule: CorrelationRule): number {
    const severityWeights = { low: 1, medium: 2, high: 3, critical: 4 };
    const ruleWeight = severityWeights[rule.severity];
    const eventScore = events.reduce((sum, e) => sum + severityWeights[e.severity], 0);
    
    return Math.min((eventScore * ruleWeight) / 10, 10); // Scale to 1-10
  }

  private generateCorrelationDescription(rule: CorrelationRule, events: ThreatEvent[]): string {
    const uniqueDevices = new Set(events.map(e => e.deviceId)).size;
    const primaryType = events[0].type;
    
    return `${rule.name}: ${events.length} related events detected across ${uniqueDevices} device(s). Primary threat type: ${primaryType}.`;
  }

  private generateRecommendations(rule: CorrelationRule, events: ThreatEvent[]): string[] {
    const recommendations = [
      'Investigate affected endpoints immediately',
      'Review network traffic logs for suspicious activity',
      'Check for indicators of compromise (IOCs)',
      'Consider isolating affected devices',
      'Verify user access patterns and permissions'
    ];

    // Add specific recommendations based on rule type
    if (rule.id === 'lateral_movement') {
      recommendations.push('Monitor for additional lateral movement attempts');
      recommendations.push('Review network segmentation policies');
    } else if (rule.id === 'coordinated_attack') {
      recommendations.push('Activate incident response procedures');
      recommendations.push('Consider threat hunting activities');
    }

    return recommendations;
  }

  getCorrelations(): ThreatCorrelation[] {
    return [...this.correlations];
  }

  getActiveCorrelations(): ThreatCorrelation[] {
    return this.correlations.filter(corr => corr.status === 'active');
  }

  updateCorrelationStatus(id: string, status: ThreatCorrelation['status']): void {
    const correlation = this.correlations.find(corr => corr.id === id);
    if (correlation) {
      correlation.status = status;
    }
  }

  getRules(): CorrelationRule[] {
    return [...this.rules];
  }

  addRule(rule: CorrelationRule): void {
    this.rules.push(rule);
  }

  updateRule(id: string, updates: Partial<CorrelationRule>): void {
    const rule = this.rules.find(r => r.id === id);
    if (rule) {
      Object.assign(rule, updates);
    }
  }
}

export { ThreatCorrelationEngine };
export type { ThreatEvent, ThreatCorrelation, CorrelationRule };
