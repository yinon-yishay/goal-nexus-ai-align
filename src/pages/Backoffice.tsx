
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types';
import { UserCog, Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock users data - in real app, this would come from a backend
const mockAllUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    role: 'employee',
    department: 'rd',
    managerId: '2'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    role: 'manager',
    department: 'rd'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    role: 'group-leader',
    department: 'sm'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@company.com',
    role: 'ld-team',
    department: 'ga'
  },
  {
    id: '5',
    name: 'Alex Thompson',
    email: 'alex@company.com',
    role: 'employee',
    department: 'sm',
    managerId: '3'
  },
  {
    id: '6',
    name: 'Jessica Wang',
    email: 'jessica@company.com',
    role: 'manager',
    department: 'ga'
  }
];

const Backoffice = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockAllUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee' as UserRole,
    department: 'rd' as 'rd' | 'sm' | 'ga',
    managerId: ''
  });

  if (!user || (user.role !== 'ld-team' && user.role !== 'group-leader')) {
    return (
      <div className="p-6">
        <div className="text-center">
          <UserCog className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the backoffice.</p>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'employee': return 'Employee';
      case 'manager': return 'Manager';
      case 'group-leader': return 'Group Leader';
      case 'ld-team': return 'L&D Team';
      default: return role;
    }
  };

  const getDepartmentName = (dept: string) => {
    switch (dept) {
      case 'rd': return 'R&D';
      case 'sm': return 'Sales & Marketing';
      case 'ga': return 'General & Administrative';
      default: return dept;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'employee': return 'default';
      case 'manager': return 'secondary';
      case 'group-leader': return 'destructive';
      case 'ld-team': return 'outline';
      default: return 'default';
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: (users.length + 1).toString(),
      ...newUser
    };

    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'employee',
      department: 'rd',
      managerId: ''
    });

    toast({
      title: "Success",
      description: "User added successfully!",
    });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
    toast({
      title: "Success",
      description: "User updated successfully!",
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Success",
      description: "User deleted successfully!",
    });
  };

  const managers = users.filter(u => u.role === 'manager' || u.role === 'group-leader');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backoffice</h1>
          <p className="text-gray-600 mt-1">Manage users and their roles</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">{users.length} total users</span>
        </div>
      </div>

      {/* Add New User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="email@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="group-leader">Group Leader</SelectItem>
                  <SelectItem value="ld-team">L&D Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={newUser.department} onValueChange={(value: 'rd' | 'sm' | 'ga') => setNewUser({ ...newUser, department: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rd">R&D</SelectItem>
                  <SelectItem value="sm">Sales & Marketing</SelectItem>
                  <SelectItem value="ga">General & Administrative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {newUser.role === 'employee' && (
            <div className="mt-4">
              <Label htmlFor="manager">Manager</Label>
              <Select value={newUser.managerId} onValueChange={(value) => setNewUser({ ...newUser, managerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No manager</SelectItem>
                  {managers.map(manager => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name} ({getRoleDisplayName(manager.role)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="mt-4">
            <Button onClick={handleAddUser} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((userItem) => (
              <div key={userItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{userItem.name}</h3>
                      <p className="text-sm text-gray-600">{userItem.email}</p>
                    </div>
                    <Badge variant={getRoleBadgeColor(userItem.role)}>
                      {getRoleDisplayName(userItem.role)}
                    </Badge>
                    <Badge variant="outline">
                      {getDepartmentName(userItem.department)}
                    </Badge>
                  </div>
                  {userItem.managerId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Manager: {users.find(u => u.id === userItem.managerId)?.name || 'Unknown'}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(userItem)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(userItem.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal - Simple implementation */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={editingUser.role} onValueChange={(value: UserRole) => setEditingUser({ ...editingUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="group-leader">Group Leader</SelectItem>
                    <SelectItem value="ld-team">L&D Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={editingUser.department} onValueChange={(value: 'rd' | 'sm' | 'ga') => setEditingUser({ ...editingUser, department: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rd">R&D</SelectItem>
                    <SelectItem value="sm">Sales & Marketing</SelectItem>
                    <SelectItem value="ga">General & Administrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleUpdateUser(editingUser)} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Backoffice;
