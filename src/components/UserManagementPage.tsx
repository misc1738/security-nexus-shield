import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Shield, Key, Settings, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'analyst' | 'operator' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  mfaEnabled: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'incidents' | 'users' | 'settings' | 'reports';
}

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  useEffect(() => {
    // Initialize with mock data
    setUsers([
      {
        id: 'USR-001',
        username: 'john.smith',
        email: 'john.smith@company.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'admin',
        department: 'IT Security',
        status: 'active',
        lastLogin: '2024-01-15T14:30:00Z',
        createdAt: '2023-06-15T09:00:00Z',
        permissions: ['dashboard.view', 'incidents.manage', 'users.manage', 'settings.manage'],
        mfaEnabled: true
      },
      {
        id: 'USR-002',
        username: 'jane.doe',
        email: 'jane.doe@company.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'analyst',
        department: 'SOC',
        status: 'active',
        lastLogin: '2024-01-15T13:45:00Z',
        createdAt: '2023-08-20T10:30:00Z',
        permissions: ['dashboard.view', 'incidents.view', 'incidents.investigate'],
        mfaEnabled: true
      },
      {
        id: 'USR-003',
        username: 'mike.johnson',
        email: 'mike.johnson@company.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        role: 'operator',
        department: 'IT Operations',
        status: 'inactive',
        lastLogin: '2024-01-10T16:20:00Z',
        createdAt: '2023-09-05T14:15:00Z',
        permissions: ['dashboard.view', 'incidents.view'],
        mfaEnabled: false
      }
    ]);

    setRoles([
      {
        id: 'ROLE-001',
        name: 'Security Administrator',
        description: 'Full access to all security functions',
        permissions: ['dashboard.view', 'incidents.manage', 'users.manage', 'settings.manage', 'reports.generate'],
        userCount: 3
      },
      {
        id: 'ROLE-002',
        name: 'Security Analyst',
        description: 'Investigate and respond to security incidents',
        permissions: ['dashboard.view', 'incidents.view', 'incidents.investigate', 'reports.view'],
        userCount: 8
      },
      {
        id: 'ROLE-003',
        name: 'SOC Operator',
        description: 'Monitor security events and alerts',
        permissions: ['dashboard.view', 'incidents.view', 'alerts.acknowledge'],
        userCount: 12
      },
      {
        id: 'ROLE-004',
        name: 'Security Viewer',
        description: 'Read-only access to security information',
        permissions: ['dashboard.view', 'reports.view'],
        userCount: 25
      }
    ]);

    setPermissions([
      {
        id: 'dashboard.view',
        name: 'View Dashboard',
        description: 'Access to security dashboard',
        category: 'dashboard'
      },
      {
        id: 'incidents.view',
        name: 'View Incidents',
        description: 'View security incidents',
        category: 'incidents'
      },
      {
        id: 'incidents.manage',
        name: 'Manage Incidents',
        description: 'Create, update, and close incidents',
        category: 'incidents'
      },
      {
        id: 'users.manage',
        name: 'Manage Users',
        description: 'Create, update, and delete users',
        category: 'users'
      },
      {
        id: 'settings.manage',
        name: 'Manage Settings',
        description: 'Configure system settings',
        category: 'settings'
      }
    ]);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'analyst': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'operator': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'viewer': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500';
      case 'locked': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-400" />
            User Management
          </h1>
          <p className="text-slate-400">Manage users, roles, and permissions</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">First Name</label>
                  <Input className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Last Name</label>
                  <Input className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Email</label>
                <Input type="email" className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Username</label>
                <Input className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Role</label>
                <Select>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)} className="border-slate-600 text-slate-300">
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-green-400">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">MFA Enabled</p>
                <p className="text-2xl font-bold text-blue-400">
                  {users.filter(u => u.mfaEnabled).length}
                </p>
              </div>
              <Key className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Roles</p>
                <p className="text-2xl font-bold text-purple-400">{roles.length}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">User Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-700">
                    <tr className="text-left">
                      <th className="p-4 text-sm font-medium text-slate-300">User</th>
                      <th className="p-4 text-sm font-medium text-slate-300">Role</th>
                      <th className="p-4 text-sm font-medium text-slate-300">Department</th>
                      <th className="p-4 text-sm font-medium text-slate-300">Status</th>
                      <th className="p-4 text-sm font-medium text-slate-300">Last Login</th>
                      <th className="p-4 text-sm font-medium text-slate-300">MFA</th>
                      <th className="p-4 text-sm font-medium text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                            <p className="text-xs text-slate-500">@{user.username}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-300">{user.department}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-300">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {user.mfaEnabled ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500">
                              ENABLED
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500">
                              DISABLED
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-600 hover:border-red-500">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-200">{role.name}</CardTitle>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">
                      {role.userCount} users
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  permissions.reduce((acc, perm) => {
                    if (!acc[perm.category]) acc[perm.category] = [];
                    acc[perm.category].push(perm);
                    return acc;
                  }, {} as Record<string, Permission[]>)
                ).map(([category, perms]) => (
                  <div key={category} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                    <h4 className="text-sm font-medium text-white mb-2 capitalize">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {perms.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-2 rounded bg-slate-800">
                          <div>
                            <span className="text-sm text-white">{permission.name}</span>
                            <p className="text-xs text-slate-400">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;