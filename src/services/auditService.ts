interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'configuration' | 'system';
}

interface AuditQuery {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: string;
  resource?: string;
  severity?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

interface AuditSummary {
  totalEvents: number;
  eventsByCategory: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  topUsers: Array<{ userId: string; username: string; eventCount: number }>;
  topActions: Array<{ action: string; eventCount: number }>;
  timeRange: { start: string; end: string };
}

class AuditService {
  private static instance: AuditService;
  private events: AuditEvent[] = [];

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  private initializeMockData(): void {
    // Generate mock audit events
    const actions = [
      'user.login', 'user.logout', 'user.create', 'user.update', 'user.delete',
      'incident.create', 'incident.update', 'incident.close',
      'settings.update', 'report.generate', 'report.download',
      'vulnerability.scan', 'compliance.assess',
      'threat.hunt', 'network.configure'
    ];

    const resources = [
      'users', 'incidents', 'vulnerabilities', 'compliance',
      'settings', 'reports', 'network', 'threats'
    ];

    const users = [
      { id: 'USR-001', username: 'john.smith' },
      { id: 'USR-002', username: 'jane.doe' },
      { id: 'USR-003', username: 'mike.johnson' },
      { id: 'USR-004', username: 'sarah.wilson' }
    ];

    for (let i = 0; i < 100; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const resource = resources[Math.floor(Math.random() * resources.length)];
      
      this.events.push({
        id: `AUD-${String(i + 1).padStart(3, '0')}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        userId: user.id,
        username: user.username,
        action,
        resource,
        resourceId: `${resource.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
        details: this.generateEventDetails(action, resource),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
        severity: this.getSeverityForAction(action),
        category: this.getCategoryForAction(action)
      });
    }

    // Sort by timestamp (newest first)
    this.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private generateEventDetails(action: string, resource: string): Record<string, any> {
    const details: Record<string, any> = {};

    if (action.includes('login')) {
      details.loginMethod = Math.random() > 0.5 ? 'password' : 'mfa';
      details.success = Math.random() > 0.1;
    } else if (action.includes('create') || action.includes('update')) {
      details.changes = {
        field1: 'old_value',
        field2: 'new_value'
      };
    } else if (action.includes('delete')) {
      details.deletedItems = Math.floor(Math.random() * 5) + 1;
    } else if (action.includes('scan')) {
      details.scanType = 'vulnerability';
      details.targetsScanned = Math.floor(Math.random() * 50) + 10;
    }

    return details;
  }

  private getSeverityForAction(action: string): 'low' | 'medium' | 'high' | 'critical' {
    if (action.includes('delete') || action.includes('settings')) {
      return 'high';
    } else if (action.includes('create') || action.includes('update')) {
      return 'medium';
    } else if (action.includes('login') && Math.random() > 0.9) {
      return 'critical'; // Failed login attempts
    }
    return 'low';
  }

  private getCategoryForAction(action: string): AuditEvent['category'] {
    if (action.includes('login') || action.includes('logout')) {
      return 'authentication';
    } else if (action.includes('user') && (action.includes('create') || action.includes('delete'))) {
      return 'authorization';
    } else if (action.includes('settings') || action.includes('configure')) {
      return 'configuration';
    } else if (action.includes('report') || action.includes('download')) {
      return 'data_access';
    }
    return 'system';
  }

  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...event
    };

    this.events.unshift(auditEvent);
    
    // Keep only the last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(0, 1000);
    }

    console.log('Audit event logged:', auditEvent);
  }

  queryEvents(query: AuditQuery = {}): AuditEvent[] {
    let filteredEvents = [...this.events];

    // Apply filters
    if (query.startDate) {
      const startDate = new Date(query.startDate);
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.timestamp) >= startDate
      );
    }

    if (query.endDate) {
      const endDate = new Date(query.endDate);
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.timestamp) <= endDate
      );
    }

    if (query.userId) {
      filteredEvents = filteredEvents.filter(event => 
        event.userId === query.userId
      );
    }

    if (query.action) {
      filteredEvents = filteredEvents.filter(event => 
        event.action.includes(query.action)
      );
    }

    if (query.resource) {
      filteredEvents = filteredEvents.filter(event => 
        event.resource === query.resource
      );
    }

    if (query.severity) {
      filteredEvents = filteredEvents.filter(event => 
        event.severity === query.severity
      );
    }

    if (query.category) {
      filteredEvents = filteredEvents.filter(event => 
        event.category === query.category
      );
    }

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    
    return filteredEvents.slice(offset, offset + limit);
  }

  getAuditSummary(query: AuditQuery = {}): AuditSummary {
    const events = this.queryEvents({ ...query, limit: undefined, offset: undefined });

    const eventsByCategory = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsBySeverity = events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const userCounts = events.reduce((acc, event) => {
      const key = `${event.userId}:${event.username}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topUsers = Object.entries(userCounts)
      .map(([key, count]) => {
        const [userId, username] = key.split(':');
        return { userId, username, eventCount: count };
      })
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);

    const actionCounts = events.reduce((acc, event) => {
      acc[event.action] = (acc[event.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, eventCount: count }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);

    const timestamps = events.map(e => new Date(e.timestamp).getTime());
    const timeRange = {
      start: timestamps.length > 0 ? new Date(Math.min(...timestamps)).toISOString() : '',
      end: timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : ''
    };

    return {
      totalEvents: events.length,
      eventsByCategory,
      eventsBySeverity,
      topUsers,
      topActions,
      timeRange
    };
  }

  exportAuditLog(query: AuditQuery = {}, format: 'csv' | 'json' = 'csv'): string {
    const events = this.queryEvents({ ...query, limit: undefined, offset: undefined });

    if (format === 'json') {
      return JSON.stringify(events, null, 2);
    }

    // CSV format
    const headers = [
      'ID', 'Timestamp', 'User ID', 'Username', 'Action', 'Resource',
      'Resource ID', 'IP Address', 'Severity', 'Category', 'Details'
    ];

    const csvRows = [
      headers.join(','),
      ...events.map(event => [
        event.id,
        event.timestamp,
        event.userId,
        event.username,
        event.action,
        event.resource,
        event.resourceId || '',
        event.ipAddress,
        event.severity,
        event.category,
        JSON.stringify(event.details).replace(/"/g, '""')
      ].map(field => `"${field}"`).join(','))
    ];

    return csvRows.join('\n');
  }

  getComplianceReport(framework: string): any {
    const relevantEvents = this.events.filter(event => 
      event.category === 'data_access' || 
      event.category === 'authorization' ||
      event.category === 'configuration'
    );

    return {
      framework,
      reportDate: new Date().toISOString(),
      totalEvents: relevantEvents.length,
      criticalEvents: relevantEvents.filter(e => e.severity === 'critical').length,
      dataAccessEvents: relevantEvents.filter(e => e.category === 'data_access').length,
      configurationChanges: relevantEvents.filter(e => e.category === 'configuration').length,
      authorizationEvents: relevantEvents.filter(e => e.category === 'authorization').length,
      events: relevantEvents.slice(0, 100) // Include sample events
    };
  }
}

export { AuditService };
export type { AuditEvent, AuditQuery, AuditSummary };