import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Users, Shield, User, Mail, Calendar } from 'lucide-react'

interface UserRecord {
  id: string
  email: string
  name?: string
  role: string
  createdAt: string
}

interface UserManagementProps {
  users: UserRecord[]
  onUpdateRole: (id: string, role: string) => Promise<void>
  isLoading: boolean
}

export function UserManagement({ users, onUpdateRole, isLoading }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Shield className="w-4 h-4 text-purple-600" />
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />
      case 'manager':
        return <User className="w-4 h-4 text-green-600" />
      default:
        return <User className="w-4 h-4 text-slate-400" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-purple-600">{role}</Badge>
      case 'admin':
        return <Badge className="bg-blue-600">{role}</Badge>
      case 'manager':
        return <Badge className="bg-green-600">{role}</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const userStats = {
    total: users.length,
    owners: users.filter(u => u.role === 'owner').length,
    admins: users.filter(u => u.role === 'admin').length,
    managers: users.filter(u => u.role === 'manager').length,
    customers: users.filter(u => u.role === 'customer').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500">Manage users and their roles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="text-2xl font-bold">{userStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Owners</p>
            <p className="text-2xl font-bold text-purple-600">{userStats.owners}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Admins</p>
            <p className="text-2xl font-bold text-blue-600">{userStats.admins}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Managers</p>
            <p className="text-2xl font-bold text-green-600">{userStats.managers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Customers</p>
            <p className="text-2xl font-bold text-slate-600">{userStats.customers}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">{filteredUsers.length} users</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                        <span className="font-medium">{user.name || 'Anonymous'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        Edit Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Role</Label>
              <p className="font-medium">{getRoleBadge(selectedUser?.role || 'customer')}</p>
            </div>
            <div className="space-y-2">
              <Label>New Role</Label>
              <div className="flex gap-2">
                {['customer', 'manager', 'admin', 'owner'].map((role) => (
                  <Button
                    key={role}
                    variant={selectedUser?.role === role ? 'default' : 'outline'}
                    onClick={async () => {
                      if (selectedUser) {
                        await onUpdateRole(selectedUser.id, role)
                        setSelectedUser({ ...selectedUser, role })
                      }
                    }}
                    disabled={selectedUser?.role === role}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}