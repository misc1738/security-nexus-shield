
import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Info, Shield, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WebSocketService, { NotificationMessage } from '@/services/websocket';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const wsService = WebSocketService.getInstance();
    wsService.connect();

    const handleNotification = (notification: NotificationMessage) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
      setUnreadCount(prev => prev + 1);
    };

    wsService.subscribe('notification-center', handleNotification);

    return () => {
      wsService.unsubscribe('notification-center');
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'threat': return <AlertTriangle className="w-4 h-4" />;
      case 'agent': return <Shield className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10';
      case 'high': return 'text-red-400 bg-red-500/10';
      case 'medium': return 'text-orange-400 bg-orange-500/10';
      case 'low': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-blue-400 bg-blue-500/10';
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="relative border-slate-600 text-slate-300 hover:text-white"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAsRead();
        }}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border-slate-700 z-50 max-h-96 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearNotifications}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="p-3 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded ${getSeverityColor(notification.severity)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationCenter;
