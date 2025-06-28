interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: any;
}

interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface FilterParams {
  [key: string]: any;
}

class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private authToken: string | null = null;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: { username: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // User management endpoints
  async getUsers(params?: PaginationParams & FilterParams): Promise<ApiResponse<any[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: any): Promise<ApiResponse<any>> {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Incident management endpoints
  async getIncidents(params?: PaginationParams & FilterParams): Promise<ApiResponse<any[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/incidents${queryString ? `?${queryString}` : ''}`);
  }

  async createIncident(incidentData: any): Promise<ApiResponse<any>> {
    return this.request('/incidents', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  }

  async updateIncident(incidentId: string, incidentData: any): Promise<ApiResponse<any>> {
    return this.request(`/incidents/${incidentId}`, {
      method: 'PUT',
      body: JSON.stringify(incidentData),
    });
  }

  // Vulnerability management endpoints
  async getVulnerabilities(params?: PaginationParams & FilterParams): Promise<ApiResponse<any[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/vulnerabilities${queryString ? `?${queryString}` : ''}`);
  }

  async scanForVulnerabilities(scanConfig: any): Promise<ApiResponse<any>> {
    return this.request('/vulnerabilities/scan', {
      method: 'POST',
      body: JSON.stringify(scanConfig),
    });
  }

  // Compliance endpoints
  async getComplianceFrameworks(): Promise<ApiResponse<any[]>> {
    return this.request('/compliance/frameworks');
  }

  async getComplianceControls(frameworkId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/compliance/frameworks/${frameworkId}/controls`);
  }

  async updateComplianceControl(controlId: string, controlData: any): Promise<ApiResponse<any>> {
    return this.request(`/compliance/controls/${controlId}`, {
      method: 'PUT',
      body: JSON.stringify(controlData),
    });
  }

  // Threat hunting endpoints
  async executeHuntingQuery(queryData: any): Promise<ApiResponse<any>> {
    return this.request('/threat-hunting/execute', {
      method: 'POST',
      body: JSON.stringify(queryData),
    });
  }

  async saveHuntingQuery(queryData: any): Promise<ApiResponse<any>> {
    return this.request('/threat-hunting/queries', {
      method: 'POST',
      body: JSON.stringify(queryData),
    });
  }

  async getHuntingQueries(): Promise<ApiResponse<any[]>> {
    return this.request('/threat-hunting/queries');
  }

  // Network security endpoints
  async getNetworkDevices(): Promise<ApiResponse<any[]>> {
    return this.request('/network/devices');
  }

  async getNetworkFlows(params?: FilterParams): Promise<ApiResponse<any[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/network/flows${queryString ? `?${queryString}` : ''}`);
  }

  async getSecurityRules(): Promise<ApiResponse<any[]>> {
    return this.request('/network/rules');
  }

  async updateSecurityRule(ruleId: string, ruleData: any): Promise<ApiResponse<any>> {
    return this.request(`/network/rules/${ruleId}`, {
      method: 'PUT',
      body: JSON.stringify(ruleData),
    });
  }

  // Reports endpoints
  async generateReport(reportConfig: any): Promise<ApiResponse<any>> {
    return this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportConfig),
    });
  }

  async getReports(): Promise<ApiResponse<any[]>> {
    return this.request('/reports');
  }

  async downloadReport(reportId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/reports/${reportId}/download`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.statusText}`);
    }

    return response.blob();
  }

  // Settings endpoints
  async getSettings(): Promise<ApiResponse<any>> {
    return this.request('/settings');
  }

  async updateSettings(settings: any): Promise<ApiResponse<any>> {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Dashboard endpoints
  async getDashboardMetrics(): Promise<ApiResponse<any>> {
    return this.request('/dashboard/metrics');
  }

  async getSecurityOverview(): Promise<ApiResponse<any>> {
    return this.request('/dashboard/security-overview');
  }

  // File upload utility
  async uploadFile(file: File, endpoint: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    });
  }

  // Webhook endpoints
  async createWebhook(webhookData: any): Promise<ApiResponse<any>> {
    return this.request('/webhooks', {
      method: 'POST',
      body: JSON.stringify(webhookData),
    });
  }

  async getWebhooks(): Promise<ApiResponse<any[]>> {
    return this.request('/webhooks');
  }

  async testWebhook(webhookId: string): Promise<ApiResponse<any>> {
    return this.request(`/webhooks/${webhookId}/test`, {
      method: 'POST',
    });
  }
}

export default ApiService;
export type { ApiResponse, ApiError, PaginationParams, FilterParams };