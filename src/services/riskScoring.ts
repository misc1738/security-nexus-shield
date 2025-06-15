interface RiskFactor {
  id: string;
  name: string;
  category: 'vulnerability' | 'behavior' | 'environment' | 'configuration' | 'threat';
  weight: number;
  value: number;
  description: string;
  source: string;
}

interface RiskAssessment {
  deviceId: string;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  trends: RiskTrend[];
  predictions: RiskPrediction[];
  lastUpdated: string;
  recommendations: string[];
}

interface RiskTrend {
  timestamp: string;
  score: number;
  factors: string[];
}

interface RiskPrediction {
  timeframe: '1h' | '6h' | '24h' | '7d' | '30d';
  predictedScore: number;
  confidence: number;
  riskFactors: string[];
}

interface DeviceMetrics {
  deviceId: string;
  vulnerabilityCount: number;
  patchLevel: number;
  lastScanDate: string;
  threatEvents: number;
  behavioralAnomalies: number;
  networkExposure: number;
  configurationScore: number;
  userRiskScore: number;
}

class PredictiveRiskScoring {
  private static instance: PredictiveRiskScoring;
  private assessments: Map<string, RiskAssessment> = new Map();
  private historicalData: Map<string, RiskTrend[]> = new Map();
  private riskFactorWeights: Map<string, number> = new Map();

  private constructor() {
    this.initializeWeights();
    this.startRiskAssessment();
  }

  static getInstance(): PredictiveRiskScoring {
    if (!PredictiveRiskScoring.instance) {
      PredictiveRiskScoring.instance = new PredictiveRiskScoring();
    }
    return PredictiveRiskScoring.instance;
  }

  private initializeWeights(): void {
    // Initialize risk factor weights
    this.riskFactorWeights.set('critical_vulnerabilities', 0.25);
    this.riskFactorWeights.set('patch_status', 0.15);
    this.riskFactorWeights.set('threat_exposure', 0.20);
    this.riskFactorWeights.set('behavioral_anomalies', 0.15);
    this.riskFactorWeights.set('network_exposure', 0.10);
    this.riskFactorWeights.set('configuration_security', 0.10);
    this.riskFactorWeights.set('user_risk', 0.05);
  }

  private startRiskAssessment(): void {
    // Perform risk assessment every 5 minutes
    setInterval(() => {
      this.performRiskAssessment();
    }, 300000);

    // Initial assessment
    setTimeout(() => {
      this.performRiskAssessment();
    }, 5000);
  }

  private performRiskAssessment(): void {
    // Simulate multiple devices
    const deviceIds = this.generateDeviceIds();
    
    deviceIds.forEach(deviceId => {
      const metrics = this.generateDeviceMetrics(deviceId);
      const assessment = this.calculateRiskAssessment(metrics);
      this.assessments.set(deviceId, assessment);
      this.updateHistoricalData(deviceId, assessment.overallScore);
    });

    console.log(`Risk assessment completed for ${deviceIds.length} devices`);
  }

  private generateDeviceIds(): string[] {
    return [
      'WS-FINANCE-01', 'WS-FINANCE-02', 'WS-HR-01', 'WS-IT-01', 'WS-MARKETING-01',
      'SRV-DATABASE-01', 'SRV-WEB-01', 'SRV-EMAIL-01', 'WS-EXEC-01', 'WS-GUEST-01'
    ];
  }

  private generateDeviceMetrics(deviceId: string): DeviceMetrics {
    // Generate realistic metrics based on device type
    const isServer = deviceId.startsWith('SRV-');
    const isExec = deviceId.includes('EXEC');
    const isGuest = deviceId.includes('GUEST');

    return {
      deviceId,
      vulnerabilityCount: Math.floor(Math.random() * (isServer ? 20 : 10)) + (isGuest ? 5 : 0),
      patchLevel: Math.random() * 100,
      lastScanDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      threatEvents: Math.floor(Math.random() * (isServer ? 50 : 20)),
      behavioralAnomalies: Math.floor(Math.random() * 10) + (isExec ? 3 : 0),
      networkExposure: Math.random() * (isServer ? 100 : 50),
      configurationScore: Math.random() * 100,
      userRiskScore: Math.random() * (isExec ? 80 : isGuest ? 60 : 40)
    };
  }

  private calculateRiskAssessment(metrics: DeviceMetrics): RiskAssessment {
    const factors = this.calculateRiskFactors(metrics);
    const overallScore = this.calculateOverallScore(factors);
    const riskLevel = this.determineRiskLevel(overallScore);
    const predictions = this.generatePredictions(metrics, overallScore);
    const recommendations = this.generateRecommendations(factors, riskLevel);

    return {
      deviceId: metrics.deviceId,
      overallScore,
      riskLevel,
      factors,
      trends: this.getDeviceTrends(metrics.deviceId),
      predictions,
      lastUpdated: new Date().toISOString(),
      recommendations
    };
  }

  private calculateRiskFactors(metrics: DeviceMetrics): RiskFactor[] {
    const factors: RiskFactor[] = [];

    // Critical vulnerabilities factor
    const vulnScore = Math.min(metrics.vulnerabilityCount / 10 * 100, 100);
    factors.push({
      id: 'critical_vulnerabilities',
      name: 'Critical Vulnerabilities',
      category: 'vulnerability',
      weight: this.riskFactorWeights.get('critical_vulnerabilities') || 0.25,
      value: vulnScore,
      description: `${metrics.vulnerabilityCount} vulnerabilities detected`,
      source: 'Vulnerability Scanner'
    });

    // Patch status factor
    const patchScore = 100 - metrics.patchLevel;
    factors.push({
      id: 'patch_status',
      name: 'Patch Status',
      category: 'configuration',
      weight: this.riskFactorWeights.get('patch_status') || 0.15,
      value: patchScore,
      description: `${metrics.patchLevel.toFixed(1)}% patched`,
      source: 'Patch Management'
    });

    // Threat exposure factor
    const threatScore = Math.min(metrics.threatEvents / 20 * 100, 100);
    factors.push({
      id: 'threat_exposure',
      name: 'Threat Exposure',
      category: 'threat',
      weight: this.riskFactorWeights.get('threat_exposure') || 0.20,
      value: threatScore,
      description: `${metrics.threatEvents} threat events in last 30 days`,
      source: 'Threat Detection'
    });

    // Behavioral anomalies factor
    const behaviorScore = Math.min(metrics.behavioralAnomalies / 5 * 100, 100);
    factors.push({
      id: 'behavioral_anomalies',
      name: 'Behavioral Anomalies',
      category: 'behavior',
      weight: this.riskFactorWeights.get('behavioral_anomalies') || 0.15,
      value: behaviorScore,
      description: `${metrics.behavioralAnomalies} anomalies detected`,
      source: 'Behavioral Analysis'
    });

    // Network exposure factor
    factors.push({
      id: 'network_exposure',
      name: 'Network Exposure',
      category: 'environment',
      weight: this.riskFactorWeights.get('network_exposure') || 0.10,
      value: metrics.networkExposure,
      description: `Network exposure score: ${metrics.networkExposure.toFixed(1)}`,
      source: 'Network Analysis'
    });

    // Configuration security factor
    const configScore = 100 - metrics.configurationScore;
    factors.push({
      id: 'configuration_security',
      name: 'Configuration Security',
      category: 'configuration',
      weight: this.riskFactorWeights.get('configuration_security') || 0.10,
      value: configScore,
      description: `Security configuration score: ${metrics.configurationScore.toFixed(1)}%`,
      source: 'Configuration Assessment'
    });

    // User risk factor
    factors.push({
      id: 'user_risk',
      name: 'User Risk',
      category: 'behavior',
      weight: this.riskFactorWeights.get('user_risk') || 0.05,
      value: metrics.userRiskScore,
      description: `User risk score: ${metrics.userRiskScore.toFixed(1)}`,
      source: 'User Behavior Analysis'
    });

    return factors;
  }

  private calculateOverallScore(factors: RiskFactor[]): number {
    const weightedSum = factors.reduce((sum, factor) => {
      return sum + (factor.value * factor.weight);
    }, 0);

    return Math.round(weightedSum * 100) / 100;
  }

  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private generatePredictions(metrics: DeviceMetrics, currentScore: number): RiskPrediction[] {
    const predictions: RiskPrediction[] = [];
    const timeframes: Array<'1h' | '6h' | '24h' | '7d' | '30d'> = ['1h', '6h', '24h', '7d', '30d'];

    timeframes.forEach(timeframe => {
      const multiplier = this.getTimeframeMultiplier(timeframe);
      const randomFactor = (Math.random() - 0.5) * 0.2; // ±10% random variation
      const trendFactor = this.calculateTrendFactor(metrics.deviceId, timeframe);
      
      const predictedScore = Math.max(0, Math.min(100, 
        currentScore * (1 + multiplier + randomFactor + trendFactor)
      ));

      predictions.push({
        timeframe,
        predictedScore: Math.round(predictedScore * 100) / 100,
        confidence: Math.max(0.5, 1 - multiplier), // Confidence decreases over time
        riskFactors: this.getPredictedRiskFactors(timeframe, metrics)
      });
    });

    return predictions;
  }

  private getTimeframeMultiplier(timeframe: string): number {
    switch (timeframe) {
      case '1h': return 0.02;
      case '6h': return 0.05;
      case '24h': return 0.1;
      case '7d': return 0.2;
      case '30d': return 0.4;
      default: return 0.1;
    }
  }

  private calculateTrendFactor(deviceId: string, timeframe: string): number {
    const trends = this.historicalData.get(deviceId) || [];
    if (trends.length < 2) return 0;

    const recent = trends.slice(0, 5);
    const slope = this.calculateSlope(recent.map((t, i) => ({ x: i, y: t.score })));
    
    return slope * 0.1; // Scale the trend impact
  }

  private calculateSlope(points: { x: number; y: number }[]): number {
    if (points.length < 2) return 0;

    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private getPredictedRiskFactors(timeframe: string, metrics: DeviceMetrics): string[] {
    const factors = ['vulnerabilities', 'threats', 'configuration'];
    
    if (timeframe === '7d' || timeframe === '30d') {
      factors.push('behavioral_changes', 'environment_changes');
    }
    
    return factors;
  }

  private generateRecommendations(factors: RiskFactor[], riskLevel: string): string[] {
    const recommendations: string[] = [];

    // High-priority recommendations based on risk factors
    const highRiskFactors = factors.filter(f => f.value > 70);
    
    highRiskFactors.forEach(factor => {
      switch (factor.id) {
        case 'critical_vulnerabilities':
          recommendations.push('Install critical security patches immediately');
          recommendations.push('Perform vulnerability assessment');
          break;
        case 'threat_exposure':
          recommendations.push('Investigate recent threat events');
          recommendations.push('Consider endpoint isolation');
          break;
        case 'behavioral_anomalies':
          recommendations.push('Review user activity logs');
          recommendations.push('Monitor for insider threats');
          break;
        case 'network_exposure':
          recommendations.push('Review network segmentation');
          recommendations.push('Update firewall rules');
          break;
      }
    });

    // General recommendations based on risk level
    if (riskLevel === 'critical') {
      recommendations.unshift('Immediate attention required');
      recommendations.push('Consider emergency incident response');
    } else if (riskLevel === 'high') {
      recommendations.unshift('High priority remediation needed');
      recommendations.push('Schedule detailed security review');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private updateHistoricalData(deviceId: string, score: number): void {
    const trends = this.historicalData.get(deviceId) || [];
    
    trends.unshift({
      timestamp: new Date().toISOString(),
      score,
      factors: ['vulnerability', 'threat', 'behavior']
    });

    // Keep last 100 data points
    this.historicalData.set(deviceId, trends.slice(0, 100));
  }

  private getDeviceTrends(deviceId: string): RiskTrend[] {
    return this.historicalData.get(deviceId) || [];
  }

  getRiskAssessment(deviceId: string): RiskAssessment | undefined {
    return this.assessments.get(deviceId);
  }

  getAllRiskAssessments(): RiskAssessment[] {
    return Array.from(this.assessments.values());
  }

  getHighRiskDevices(): RiskAssessment[] {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.riskLevel === 'high' || assessment.riskLevel === 'critical')
      .sort((a, b) => b.overallScore - a.overallScore);
  }

  updateRiskFactorWeight(factorId: string, weight: number): void {
    this.riskFactorWeights.set(factorId, weight);
    // Trigger re-assessment
    this.performRiskAssessment();
  }
}

export { PredictiveRiskScoring };
export type { RiskAssessment, RiskFactor, RiskPrediction, RiskTrend };
