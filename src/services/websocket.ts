
export interface NotificationMessage {
  id: string;
  type: 'threat' | 'system' | 'agent' | 'policy';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  timestamp: string;
  data?: any;
}

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private listeners: Map<string, (message: NotificationMessage) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(): void {
    // Mock WebSocket connection since we don't have a real backend
    this.simulateConnection();
  }

  private simulateConnection(): void {
    console.log('Simulating WebSocket connection...');
    
    // Simulate periodic notifications
    setInterval(() => {
      this.simulateNotification();
    }, 30000); // Every 30 seconds
  }

  private simulateNotification(): void {
    const mockNotifications: NotificationMessage[] = [
      {
        id: Date.now().toString(),
        type: 'threat',
        severity: 'high',
        title: 'New Threat Detected',
        message: 'Malicious file detected on WS-FINANCE-08',
        timestamp: new Date().toISOString()
      },
      {
        id: Date.now().toString(),
        type: 'agent',
        severity: 'info',
        title: 'Agent Status Update',
        message: '5 agents updated successfully',
        timestamp: new Date().toISOString()
      }
    ];

    const notification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
    this.notifyListeners(notification);
  }

  subscribe(id: string, callback: (message: NotificationMessage) => void): void {
    this.listeners.set(id, callback);
  }

  unsubscribe(id: string): void {
    this.listeners.delete(id);
  }

  private notifyListeners(message: NotificationMessage): void {
    this.listeners.forEach(callback => callback(message));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default WebSocketService;
