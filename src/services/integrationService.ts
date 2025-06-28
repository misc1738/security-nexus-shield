interface Integration {
  id: string;
  name: string;
  type: 'siem' | 'edr' | 'firewall' | 'email' | 'ticketing' | 'threat_intel' | 'cloud' | 'identity';
  vendor: string;
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  version: string;
  lastSync: string;
  configuration: Record<string, any>;
  capabilities: string[];
  dataTypes: string[];
  healthScore: number;
}

interface IntegrationTemplate {
  id: string;
  name: string;
  vendor: string;
  type: string;
  description: string;
  configurationSchema: ConfigurationField[];
  supportedVersions: string[];
  documentation: string;
}

interface ConfigurationField {
  name: string;
  type: 'text' | 'password' | 'url' | 'number' | 'boolean' | 'select';
  required: boolean;
  description: string;
  options?: string[];
  validation?: string;
}

interface DataMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
}

interface SyncResult {
  integrationId: string;
  startTime: string;
  endTime: string;
  status: 'success' | 'partial' | 'failed';
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: string[];
}

class IntegrationService {
  private static instance: IntegrationService;
  private integrations: Map<string, Integration> = new Map();
  private templates: Map<string, IntegrationTemplate> = new Map();
  private syncHistory: SyncResult[] = [];

  private constructor() {
    this.initializeTemplates();
    this.initializeMockIntegrations();
  }

  static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  private initializeTemplates(): void {
    const templates: IntegrationTemplate[] = [
      {
        id: 'splunk-siem',
        name: 'Splunk SIEM',
        vendor: 'Splunk',
        type: 'siem',
        description: 'Connect to Splunk for log aggregation and analysis',
        configurationSchema: [
          {
            name: 'host',
            type: 'url',
            required: true,
            description: 'Splunk server URL'
          },
          {
            name: 'username',
            type: 'text',
            required: true,
            description: 'Splunk username'
          },
          {
            name: 'password',
            type: 'password',
            required: true,
            description: 'Splunk password'
          },
          {
            name: 'index',
            type: 'text',
            required: true,
            description: 'Default index for data ingestion'
          }
        ],
        supportedVersions: ['8.0+', '9.0+'],
        documentation: 'https://docs.splunk.com/Documentation'
      },
      {
        id: 'crowdstrike-edr',
        name: 'CrowdStrike Falcon',
        vendor: 'CrowdStrike',
        type: 'edr',
        description: 'Endpoint detection and response integration',
        configurationSchema: [
          {
            name: 'client_id',
            type: 'text',
            required: true,
            description: 'CrowdStrike API Client ID'
          },
          {
            name: 'client_secret',
            type: 'password',
            required: true,
            description: 'CrowdStrike API Client Secret'
          },
          {
            name: 'base_url',
            type: 'select',
            required: true,
            description: 'CrowdStrike cloud region',
            options: ['https://api.crowdstrike.com', 'https://api.eu-1.crowdstrike.com']
          }
        ],
        supportedVersions: ['API v2'],
        documentation: 'https://falcon.crowdstrike.com/documentation'
      },
      {
        id: 'palo-alto-firewall',
        name: 'Palo Alto Networks Firewall',
        vendor: 'Palo Alto Networks',
        type: 'firewall',
        description: 'Next-generation firewall integration',
        configurationSchema: [
          {
            name: 'host',
            type: 'url',
            required: true,
            description: 'Firewall management IP'
          },
          {
            name: 'api_key',
            type: 'password',
            required: true,
            description: 'API key for authentication'
          },
          {
            name: 'vsys',
            type: 'text',
            required: false,
            description: 'Virtual system (default: vsys1)'
          }
        ],
        supportedVersions: ['PAN-OS 9.0+', 'PAN-OS 10.0+'],
        documentation: 'https://docs.paloaltonetworks.com/'
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private initializeMockIntegrations(): void {
    const integrations: Integration[] = [
      {
        id: 'INT-001',
        name: 'Splunk Enterprise',
        type: 'siem',
        vendor: 'Splunk',
        status: 'connected',
        version: '9.0.2',
        lastSync: '2024-01-15T15:30:00Z',
        configuration: {
          host: 'https://splunk.company.com:8089',
          username: 'sentinel_user',
          index: 'security_events'
        },
        capabilities: ['log_ingestion', 'search', 'alerting'],
        dataTypes: ['logs', 'events', 'alerts'],
        healthScore: 95
      },
      {
        id: 'INT-002',
        name: 'CrowdStrike Falcon',
        type: 'edr',
        vendor: 'CrowdStrike',
        status: 'connected',
        version: 'API v2',
        lastSync: '2024-01-15T15:25:00Z',
        configuration: {
          client_id: 'cs_client_123',
          base_url: 'https://api.crowdstrike.com'
        },
        capabilities: ['endpoint_isolation', 'threat_detection', 'file_analysis'],
        dataTypes: ['detections', 'incidents', 'host_info'],
        healthScore: 98
      },
      {
        id: 'INT-003',
        name: 'Palo Alto Firewall',
        type: 'firewall',
        vendor: 'Palo Alto Networks',
        status: 'error',
        version: 'PAN-OS 10.1',
        lastSync: '2024-01-15T14:45:00Z',
        configuration: {
          host: 'https://firewall.company.com',
          vsys: 'vsys1'
        },
        capabilities: ['rule_management', 'traffic_logs', 'threat_prevention'],
        dataTypes: ['traffic_logs', 'threat_logs', 'config_logs'],
        healthScore: 65
      }
    ];

    integrations.forEach(integration => {
      this.integrations.set(integration.id, integration);
    });
  }

  getIntegrations(): Integration[] {
    return Array.from(this.integrations.values());
  }

  getIntegration(id: string): Integration | undefined {
    return this.integrations.get(id);
  }

  getIntegrationTemplates(): IntegrationTemplate[] {
    return Array.from(this.templates.values());
  }

  getIntegrationTemplate(id: string): IntegrationTemplate | undefined {
    return this.templates.get(id);
  }

  async createIntegration(templateId: string, configuration: Record<string, any>): Promise<Integration> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Validate configuration
    this.validateConfiguration(template.configurationSchema, configuration);

    const integration: Integration = {
      id: `INT-${Date.now()}`,
      name: template.name,
      type: template.type as any,
      vendor: template.vendor,
      status: 'configuring',
      version: template.supportedVersions[0],
      lastSync: '',
      configuration,
      capabilities: this.getCapabilitiesForType(template.type),
      dataTypes: this.getDataTypesForType(template.type),
      healthScore: 0
    };

    this.integrations.set(integration.id, integration);

    // Simulate connection test
    setTimeout(() => {
      this.testConnection(integration.id);
    }, 2000);

    return integration;
  }

  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration> {
    const integration = this.integrations.get(id);
    if (!integration) {
      throw new Error(`Integration ${id} not found`);
    }

    const updatedIntegration = { ...integration, ...updates };
    this.integrations.set(id, updatedIntegration);

    return updatedIntegration;
  }

  async deleteIntegration(id: string): Promise<void> {
    if (!this.integrations.has(id)) {
      throw new Error(`Integration ${id} not found`);
    }

    this.integrations.delete(id);
  }

  async testConnection(id: string): Promise<boolean> {
    const integration = this.integrations.get(id);
    if (!integration) {
      throw new Error(`Integration ${id} not found`);
    }

    // Simulate connection test
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        
        integration.status = success ? 'connected' : 'error';
        integration.healthScore = success ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 30;
        
        if (success) {
          integration.lastSync = new Date().toISOString();
        }

        this.integrations.set(id, integration);
        resolve(success);
      }, 1000);
    });
  }

  async syncData(id: string): Promise<SyncResult> {
    const integration = this.integrations.get(id);
    if (!integration) {
      throw new Error(`Integration ${id} not found`);
    }

    if (integration.status !== 'connected') {
      throw new Error(`Integration ${id} is not connected`);
    }

    const startTime = new Date().toISOString();
    
    // Simulate data sync
    return new Promise((resolve) => {
      setTimeout(() => {
        const recordsProcessed = Math.floor(Math.random() * 1000) + 100;
        const successRate = Math.random() * 0.2 + 0.8; // 80-100% success rate
        const recordsSuccessful = Math.floor(recordsProcessed * successRate);
        const recordsFailed = recordsProcessed - recordsSuccessful;

        const result: SyncResult = {
          integrationId: id,
          startTime,
          endTime: new Date().toISOString(),
          status: recordsFailed === 0 ? 'success' : recordsFailed < recordsProcessed * 0.1 ? 'partial' : 'failed',
          recordsProcessed,
          recordsSuccessful,
          recordsFailed,
          errors: recordsFailed > 0 ? ['Connection timeout', 'Invalid data format'] : []
        };

        this.syncHistory.unshift(result);
        this.syncHistory = this.syncHistory.slice(0, 100); // Keep last 100 sync results

        // Update integration
        integration.lastSync = result.endTime;
        integration.healthScore = Math.floor((recordsSuccessful / recordsProcessed) * 100);
        this.integrations.set(id, integration);

        resolve(result);
      }, 3000);
    });
  }

  getSyncHistory(integrationId?: string): SyncResult[] {
    if (integrationId) {
      return this.syncHistory.filter(result => result.integrationId === integrationId);
    }
    return this.syncHistory;
  }

  private validateConfiguration(schema: ConfigurationField[], configuration: Record<string, any>): void {
    for (const field of schema) {
      if (field.required && !configuration[field.name]) {
        throw new Error(`Required field ${field.name} is missing`);
      }

      if (configuration[field.name] && field.type === 'url') {
        try {
          new URL(configuration[field.name]);
        } catch {
          throw new Error(`Field ${field.name} must be a valid URL`);
        }
      }
    }
  }

  private getCapabilitiesForType(type: string): string[] {
    const capabilityMap: Record<string, string[]> = {
      siem: ['log_ingestion', 'search', 'alerting', 'correlation'],
      edr: ['endpoint_isolation', 'threat_detection', 'file_analysis', 'process_monitoring'],
      firewall: ['rule_management', 'traffic_logs', 'threat_prevention', 'url_filtering'],
      email: ['email_security', 'phishing_detection', 'attachment_analysis'],
      ticketing: ['ticket_creation', 'ticket_updates', 'workflow_automation'],
      threat_intel: ['ioc_feeds', 'threat_attribution', 'reputation_scoring'],
      cloud: ['cloud_security', 'configuration_assessment', 'compliance_monitoring'],
      identity: ['user_management', 'access_control', 'authentication']
    };

    return capabilityMap[type] || [];
  }

  private getDataTypesForType(type: string): string[] {
    const dataTypeMap: Record<string, string[]> = {
      siem: ['logs', 'events', 'alerts', 'incidents'],
      edr: ['detections', 'incidents', 'host_info', 'process_data'],
      firewall: ['traffic_logs', 'threat_logs', 'config_logs', 'system_logs'],
      email: ['email_logs', 'threat_detections', 'quarantine_data'],
      ticketing: ['tickets', 'comments', 'attachments', 'workflows'],
      threat_intel: ['indicators', 'reports', 'campaigns', 'actors'],
      cloud: ['resources', 'configurations', 'compliance_data', 'security_findings'],
      identity: ['users', 'groups', 'permissions', 'authentication_logs']
    };

    return dataTypeMap[type] || [];
  }

  getIntegrationsByType(type: string): Integration[] {
    return Array.from(this.integrations.values()).filter(integration => integration.type === type);
  }

  getHealthSummary(): { average: number; healthy: number; warning: number; critical: number } {
    const integrations = Array.from(this.integrations.values());
    const healthScores = integrations.map(i => i.healthScore);
    
    const average = healthScores.length > 0 ? 
      Math.round(healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length) : 0;
    
    const healthy = integrations.filter(i => i.healthScore >= 80).length;
    const warning = integrations.filter(i => i.healthScore >= 60 && i.healthScore < 80).length;
    const critical = integrations.filter(i => i.healthScore < 60).length;

    return { average, healthy, warning, critical };
  }
}

export { IntegrationService };
export type { Integration, IntegrationTemplate, ConfigurationField, SyncResult };