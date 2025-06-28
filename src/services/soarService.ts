interface PlaybookAction {
  id: string;
  type: 'isolate_endpoint' | 'block_ip' | 'quarantine_file' | 'send_notification' | 'create_ticket' | 'run_scan';
  name: string;
  description: string;
  parameters: Record<string, any>;
  timeout: number;
  retryCount: number;
  onSuccess?: string; // Next action ID
  onFailure?: string; // Next action ID
}

interface SecurityPlaybook {
  id: string;
  name: string;
  description: string;
  triggerConditions: TriggerCondition[];
  actions: PlaybookAction[];
  status: 'active' | 'inactive' | 'testing';
  version: string;
  author: string;
  createdAt: string;
  lastModified: string;
  executionCount: number;
  successRate: number;
}

interface TriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
  logicOperator?: 'AND' | 'OR';
}

interface PlaybookExecution {
  id: string;
  playbookId: string;
  triggeredBy: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  currentAction?: string;
  actionResults: ActionResult[];
  context: Record<string, any>;
}

interface ActionResult {
  actionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime: string;
  endTime?: string;
  result?: any;
  error?: string;
}

class SOARService {
  private static instance: SOARService;
  private playbooks: Map<string, SecurityPlaybook> = new Map();
  private executions: Map<string, PlaybookExecution> = new Map();
  private integrations: Map<string, any> = new Map();

  private constructor() {
    this.initializeDefaultPlaybooks();
    this.initializeIntegrations();
  }

  static getInstance(): SOARService {
    if (!SOARService.instance) {
      SOARService.instance = new SOARService();
    }
    return SOARService.instance;
  }

  private initializeDefaultPlaybooks(): void {
    const malwareResponsePlaybook: SecurityPlaybook = {
      id: 'PB-MALWARE-001',
      name: 'Malware Detection Response',
      description: 'Automated response to malware detection events',
      triggerConditions: [
        {
          field: 'event_type',
          operator: 'equals',
          value: 'malware_detected'
        },
        {
          field: 'severity',
          operator: 'greater_than',
          value: 7,
          logicOperator: 'AND'
        }
      ],
      actions: [
        {
          id: 'ACTION-001',
          type: 'isolate_endpoint',
          name: 'Isolate Infected Endpoint',
          description: 'Immediately isolate the infected endpoint from the network',
          parameters: {
            endpoint_id: '${event.device_id}',
            isolation_type: 'full'
          },
          timeout: 30,
          retryCount: 3,
          onSuccess: 'ACTION-002',
          onFailure: 'ACTION-004'
        },
        {
          id: 'ACTION-002',
          type: 'quarantine_file',
          name: 'Quarantine Malicious File',
          description: 'Move the malicious file to quarantine',
          parameters: {
            file_path: '${event.file_path}',
            file_hash: '${event.file_hash}'
          },
          timeout: 15,
          retryCount: 2,
          onSuccess: 'ACTION-003'
        },
        {
          id: 'ACTION-003',
          type: 'send_notification',
          name: 'Notify Security Team',
          description: 'Send notification to security team',
          parameters: {
            recipients: ['security-team@company.com'],
            priority: 'high',
            message: 'Malware detected and contained on ${event.device_id}'
          },
          timeout: 10,
          retryCount: 1
        },
        {
          id: 'ACTION-004',
          type: 'create_ticket',
          name: 'Create Incident Ticket',
          description: 'Create incident ticket for manual investigation',
          parameters: {
            title: 'Malware Detection - ${event.device_id}',
            priority: 'critical',
            assignee: 'security-team'
          },
          timeout: 20,
          retryCount: 2
        }
      ],
      status: 'active',
      version: '1.0',
      author: 'Security Team',
      createdAt: '2024-01-01T00:00:00Z',
      lastModified: '2024-01-15T10:00:00Z',
      executionCount: 47,
      successRate: 94.7
    };

    this.playbooks.set(malwareResponsePlaybook.id, malwareResponsePlaybook);
  }

  private initializeIntegrations(): void {
    // Mock integrations with security tools
    this.integrations.set('endpoint_protection', {
      name: 'Endpoint Protection Platform',
      type: 'epp',
      status: 'connected',
      capabilities: ['isolate_endpoint', 'quarantine_file', 'run_scan']
    });

    this.integrations.set('firewall', {
      name: 'Next-Gen Firewall',
      type: 'firewall',
      status: 'connected',
      capabilities: ['block_ip', 'block_domain', 'create_rule']
    });

    this.integrations.set('ticketing', {
      name: 'IT Service Management',
      type: 'itsm',
      status: 'connected',
      capabilities: ['create_ticket', 'update_ticket', 'close_ticket']
    });
  }

  createPlaybook(playbookData: Partial<SecurityPlaybook>): SecurityPlaybook {
    const playbook: SecurityPlaybook = {
      id: `PB-${Date.now()}`,
      name: playbookData.name || 'Untitled Playbook',
      description: playbookData.description || '',
      triggerConditions: playbookData.triggerConditions || [],
      actions: playbookData.actions || [],
      status: 'inactive',
      version: '1.0',
      author: playbookData.author || 'Unknown',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      executionCount: 0,
      successRate: 0
    };

    this.playbooks.set(playbook.id, playbook);
    return playbook;
  }

  async executePlaybook(playbookId: string, triggerEvent: any): Promise<PlaybookExecution> {
    const playbook = this.playbooks.get(playbookId);
    if (!playbook) {
      throw new Error(`Playbook ${playbookId} not found`);
    }

    const execution: PlaybookExecution = {
      id: `EXEC-${Date.now()}`,
      playbookId,
      triggeredBy: triggerEvent.source || 'manual',
      startTime: new Date().toISOString(),
      status: 'running',
      actionResults: [],
      context: { event: triggerEvent }
    };

    this.executions.set(execution.id, execution);

    // Execute actions sequentially
    try {
      for (const action of playbook.actions) {
        const result = await this.executeAction(action, execution.context);
        execution.actionResults.push(result);

        if (result.status === 'failed' && action.onFailure) {
          // Handle failure path
          const failureAction = playbook.actions.find(a => a.id === action.onFailure);
          if (failureAction) {
            const failureResult = await this.executeAction(failureAction, execution.context);
            execution.actionResults.push(failureResult);
          }
        }
      }

      execution.status = 'completed';
      execution.endTime = new Date().toISOString();
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date().toISOString();
    }

    // Update playbook statistics
    playbook.executionCount++;
    const successfulExecutions = Array.from(this.executions.values())
      .filter(e => e.playbookId === playbookId && e.status === 'completed').length;
    playbook.successRate = (successfulExecutions / playbook.executionCount) * 100;

    this.playbooks.set(playbookId, playbook);
    this.executions.set(execution.id, execution);

    return execution;
  }

  private async executeAction(action: PlaybookAction, context: any): Promise<ActionResult> {
    const result: ActionResult = {
      actionId: action.id,
      status: 'running',
      startTime: new Date().toISOString()
    };

    try {
      // Simulate action execution
      await this.simulateActionExecution(action, context);
      
      result.status = 'completed';
      result.endTime = new Date().toISOString();
      result.result = { success: true, message: `${action.name} completed successfully` };
    } catch (error) {
      result.status = 'failed';
      result.endTime = new Date().toISOString();
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return result;
  }

  private async simulateActionExecution(action: PlaybookAction, context: any): Promise<void> {
    // Simulate different action types
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        
        if (success) {
          console.log(`Executed action: ${action.name}`);
          resolve();
        } else {
          reject(new Error(`Failed to execute ${action.name}`));
        }
      }, Math.random() * 2000 + 500); // Random delay 0.5-2.5 seconds
    });
  }

  checkTriggerConditions(event: any): string[] {
    const triggeredPlaybooks: string[] = [];

    for (const [id, playbook] of this.playbooks) {
      if (playbook.status !== 'active') continue;

      const conditionsMet = playbook.triggerConditions.every(condition => {
        const eventValue = this.getEventValue(event, condition.field);
        return this.evaluateCondition(eventValue, condition.operator, condition.value);
      });

      if (conditionsMet) {
        triggeredPlaybooks.push(id);
      }
    }

    return triggeredPlaybooks;
  }

  private getEventValue(event: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], event);
  }

  private evaluateCondition(eventValue: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
      case 'equals':
        return eventValue === conditionValue;
      case 'contains':
        return String(eventValue).toLowerCase().includes(String(conditionValue).toLowerCase());
      case 'greater_than':
        return Number(eventValue) > Number(conditionValue);
      case 'less_than':
        return Number(eventValue) < Number(conditionValue);
      default:
        return false;
    }
  }

  getPlaybooks(): SecurityPlaybook[] {
    return Array.from(this.playbooks.values());
  }

  getPlaybook(id: string): SecurityPlaybook | undefined {
    return this.playbooks.get(id);
  }

  getExecutions(): PlaybookExecution[] {
    return Array.from(this.executions.values());
  }

  getExecution(id: string): PlaybookExecution | undefined {
    return this.executions.get(id);
  }

  getIntegrations(): any[] {
    return Array.from(this.integrations.values());
  }
}

export { SOARService };
export type { SecurityPlaybook, PlaybookAction, PlaybookExecution, TriggerCondition };