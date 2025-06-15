
interface AnomalyData {
  id: string;
  timestamp: string;
  type: 'network' | 'process' | 'file' | 'user' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  features: Record<string, number>;
  deviceId: string;
  metadata: Record<string, any>;
}

interface MLModel {
  predict(features: number[]): { anomaly: boolean; confidence: number };
  retrain(data: number[][]): void;
}

class SimpleAnomalyDetector implements MLModel {
  private threshold = 0.7;
  private historicalData: number[][] = [];

  predict(features: number[]): { anomaly: boolean; confidence: number } {
    // Simple statistical anomaly detection using z-score
    if (this.historicalData.length < 10) {
      return { anomaly: false, confidence: 0.5 };
    }

    const means = this.calculateMeans();
    const stds = this.calculateStandardDeviations(means);
    
    let anomalyScore = 0;
    features.forEach((value, index) => {
      if (stds[index] > 0) {
        const zScore = Math.abs((value - means[index]) / stds[index]);
        anomalyScore = Math.max(anomalyScore, zScore / 3); // Normalize to 0-1
      }
    });

    const confidence = Math.min(anomalyScore, 1);
    return {
      anomaly: confidence > this.threshold,
      confidence
    };
  }

  retrain(data: number[][]): void {
    this.historicalData = [...this.historicalData, ...data].slice(-1000); // Keep last 1000 samples
  }

  private calculateMeans(): number[] {
    const featureCount = this.historicalData[0]?.length || 0;
    const means: number[] = [];
    
    for (let i = 0; i < featureCount; i++) {
      const sum = this.historicalData.reduce((acc, row) => acc + (row[i] || 0), 0);
      means[i] = sum / this.historicalData.length;
    }
    
    return means;
  }

  private calculateStandardDeviations(means: number[]): number[] {
    const stds: number[] = [];
    
    for (let i = 0; i < means.length; i++) {
      const variance = this.historicalData.reduce((acc, row) => {
        const diff = (row[i] || 0) - means[i];
        return acc + diff * diff;
      }, 0) / this.historicalData.length;
      stds[i] = Math.sqrt(variance);
    }
    
    return stds;
  }
}

class AnomalyDetectionService {
  private static instance: AnomalyDetectionService;
  private detectors: Map<string, MLModel> = new Map();
  private anomalies: AnomalyData[] = [];

  private constructor() {
    this.initializeDetectors();
    this.startMonitoring();
  }

  static getInstance(): AnomalyDetectionService {
    if (!AnomalyDetectionService.instance) {
      AnomalyDetectionService.instance = new AnomalyDetectionService();
    }
    return AnomalyDetectionService.instance;
  }

  private initializeDetectors(): void {
    this.detectors.set('network', new SimpleAnomalyDetector());
    this.detectors.set('process', new SimpleAnomalyDetector());
    this.detectors.set('file', new SimpleAnomalyDetector());
    this.detectors.set('user', new SimpleAnomalyDetector());
    this.detectors.set('system', new SimpleAnomalyDetector());
  }

  private startMonitoring(): void {
    // Simulate real-time monitoring
    setInterval(() => {
      this.simulateAnomalyDetection();
    }, 15000); // Check every 15 seconds
  }

  private simulateAnomalyDetection(): void {
    const types: Array<'network' | 'process' | 'file' | 'user' | 'system'> = 
      ['network', 'process', 'file', 'user', 'system'];
    
    types.forEach(type => {
      const features = this.generateMockFeatures(type);
      const detector = this.detectors.get(type);
      
      if (detector) {
        const result = detector.predict(features);
        
        if (result.anomaly && Math.random() > 0.8) { // 20% chance to report anomaly
          this.createAnomaly(type, result.confidence, features);
        }
        
        // Retrain with new data (in real implementation, this would be actual system data)
        detector.retrain([features]);
      }
    });
  }

  private generateMockFeatures(type: string): number[] {
    // Generate realistic mock features based on type
    switch (type) {
      case 'network':
        return [
          Math.random() * 1000, // Bytes per second
          Math.random() * 100,  // Connections per minute
          Math.random() * 50,   // Unique destinations
          Math.random() * 10    // Failed connections
        ];
      case 'process':
        return [
          Math.random() * 100,  // CPU usage
          Math.random() * 1000, // Memory usage MB
          Math.random() * 50,   // File operations per minute
          Math.random() * 20    // Network connections
        ];
      case 'file':
        return [
          Math.random() * 100,  // File modifications per minute
          Math.random() * 10,   // Executable files created
          Math.random() * 50,   // System file accesses
          Math.random() * 5     // Registry modifications
        ];
      case 'user':
        return [
          Math.random() * 10,   // Login attempts
          Math.random() * 100,  // Commands executed
          Math.random() * 20,   // Privilege escalations
          Math.random() * 5     // Failed authentications
        ];
      case 'system':
        return [
          Math.random() * 100,  // System load
          Math.random() * 10,   // Service restarts
          Math.random() * 5,    // Configuration changes
          Math.random() * 3     // Error events
        ];
      default:
        return [Math.random(), Math.random(), Math.random(), Math.random()];
    }
  }

  private createAnomaly(type: string, confidence: number, features: number[]): void {
    const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
    const severity = severities[Math.floor(confidence * severities.length)];
    
    const anomaly: AnomalyData = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toISOString(),
      type,
      severity,
      confidence,
      description: this.generateAnomalyDescription(type, severity),
      features: this.featuresToObject(type, features),
      deviceId: `WS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      metadata: {
        detectionMethod: 'ML_Statistical',
        featureVector: features
      }
    };

    this.anomalies.unshift(anomaly);
    this.anomalies = this.anomalies.slice(0, 100); // Keep last 100 anomalies
    
    console.log('Anomaly detected:', anomaly);
  }

  private generateAnomalyDescription(type: string, severity: string): string {
    const descriptions = {
      network: [
        'Unusual network traffic pattern detected',
        'Abnormal connection behavior observed',
        'Suspicious data transfer volume'
      ],
      process: [
        'Abnormal process execution pattern',
        'Unusual resource consumption detected',
        'Suspicious process behavior observed'
      ],
      file: [
        'Unusual file system activity',
        'Abnormal file modification pattern',
        'Suspicious file access behavior'
      ],
      user: [
        'Unusual user behavior pattern',
        'Abnormal authentication activity',
        'Suspicious privilege usage'
      ],
      system: [
        'Abnormal system performance pattern',
        'Unusual system configuration changes',
        'Suspicious system event sequence'
      ]
    };

    const typeDescriptions = descriptions[type as keyof typeof descriptions] || descriptions.system;
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
  }

  private featuresToObject(type: string, features: number[]): Record<string, number> {
    const featureNames = {
      network: ['bytesPerSecond', 'connectionsPerMinute', 'uniqueDestinations', 'failedConnections'],
      process: ['cpuUsage', 'memoryUsageMB', 'fileOperations', 'networkConnections'],
      file: ['modificationsPerMinute', 'executablesCreated', 'systemFileAccesses', 'registryMods'],
      user: ['loginAttempts', 'commandsExecuted', 'privilegeEscalations', 'failedAuth'],
      system: ['systemLoad', 'serviceRestarts', 'configChanges', 'errorEvents']
    };

    const names = featureNames[type as keyof typeof featureNames] || featureNames.system;
    const result: Record<string, number> = {};
    
    features.forEach((value, index) => {
      if (names[index]) {
        result[names[index]] = Math.round(value * 100) / 100;
      }
    });

    return result;
  }

  getAnomalies(): AnomalyData[] {
    return [...this.anomalies];
  }

  getAnomaliesByType(type: string): AnomalyData[] {
    return this.anomalies.filter(anomaly => anomaly.type === type);
  }

  getAnomaliesBySeverity(severity: string): AnomalyData[] {
    return this.anomalies.filter(anomaly => anomaly.severity === severity);
  }
}

export { AnomalyDetectionService };
export type { AnomalyData };
