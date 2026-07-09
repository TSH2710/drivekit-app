import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Percent,
  DollarSign,
  Clock,
  CheckCircle,
} from 'lucide-react'

interface SeasonalRule {
  id: string
  name: string
  description?: string
  discountType: string
  discountValue: number
  category?: string
  tags?: string
  startDate?: string
  endDate?: string
  isActive: boolean
  priority: number
}

interface SeasonalSalesProps {
  rules: SeasonalRule[]
  onCreate: (rule: Partial<SeasonalRule>) => Promise<void>
  onUpdate: (id: string, updates: Partial<SeasonalRule>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isLoading: boolean
}

export function SeasonalSales({
  rules,
  onCreate,
  onUpdate,
  onDelete,
  isLoading,
}: SeasonalSalesProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<SeasonalRule | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<SeasonalRule | null>(null)

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    category: '',
    tags: '',
    startDate: '',
    endDate: '',
    priority: 0,
  })

  const handleCreate = async () => {
    await onCreate({
      ...newRule,
      startDate: newRule.startDate ? new Date(newRule.startDate).toISOString() : undefined,
      endDate: newRule.endDate ? new Date(newRule.endDate).toISOString() : undefined,
    })
    setIsCreateDialogOpen(false)
    setNewRule({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      category: '',
      tags: '',
      startDate: '',
      endDate: '',
      priority: 0,
    })
  }

  const handleUpdate = async () => {
    if (editingRule) {
      await onUpdate(editingRule.id, {
        name: editingRule.name,
        description: editingRule.description,
        discountType: editingRule.discountType,
        discountValue: editingRule.discountValue,
        category: editingRule.category,
        tags: editingRule.tags,
        isActive: editingRule.isActive,
        priority: editingRule.priority,
      })
      setEditingRule(null)
    }
  }

  const activeRules = rules.filter(r => r.isActive)
  const upcomingRules = rules.filter(r => {
    if (!r.startDate) return false
    return new Date(r.startDate) > new Date()
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Seasonal Sales</h2>
          <p className="text-slate-500">Manage discounts and promotional rules</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">{activeRules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingRules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Rules</p>
                <p className="text-2xl font-bold text-purple-600">{rules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discount Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    No seasonal rules configured yet
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        {rule.description && (
                          <p className="text-sm text-slate-500 truncate max-w-xs">{rule.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={rule.discountType === 'percentage' ? 'bg-blue-600' : 'bg-green-600'}>
                        {rule.discountType === 'percentage' ? (
                          <><Percent className="w-3 h-3 mr-1" />{rule.discountValue}%</>
                        ) : (
                          <><DollarSign className="w-3 h-3 mr-1" />${rule.discountValue}</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.category && (
                          <Badge variant="outline">
                            <Tag className="w-3 h-3 mr-1" />
                            {rule.category}
                          </Badge>
                        )}
                        {rule.tags && (
                          <Badge variant="outline">
                            {rule.tags}
                          </Badge>
                        )}
                        {!rule.category && !rule.tags && (
                          <span className="text-slate-400">All products</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {rule.startDate || rule.endDate ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {rule.startDate && new Date(rule.startDate).toLocaleDateString()}
                          {rule.startDate && rule.endDate && ' - '}
                          {rule.endDate && new Date(rule.endDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-slate-400">Always active</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRule(rule)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRuleToDelete(rule)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Discount Rule</DialogTitle>
            <DialogDescription>
              Set up a new seasonal discount or promotional rule
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>Rule Name</Label>
              <Input
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Summer Sale 2024"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select
                value={newRule.discountType}
                onValueChange={(value) => setNewRule({ ...newRule, discountType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Discount Value</Label>
              <Input
                type="number"
                value={newRule.discountValue}
                onChange={(e) => setNewRule({ ...newRule, discountValue: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category (optional)</Label>
              <Input
                value={newRule.category}
                onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                placeholder="e.g., Car Parts"
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (optional, comma-separated)</Label>
              <Input
                value={newRule.tags}
                onChange={(e) => setNewRule({ ...newRule, tags: e.target.value })}
                placeholder="e.g., summer, outdoor"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date (optional)</Label>
              <Input
                type="date"
                value={newRule.startDate}
                onChange={(e) => setNewRule({ ...newRule, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date (optional)</Label>
              <Input
                type="date"
                value={newRule.endDate}
                onChange={(e) => setNewRule({ ...newRule, endDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Input
                type="number"
                value={newRule.priority}
                onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newRule.name}>
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Discount Rule</DialogTitle>
          </DialogHeader>
          {editingRule && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label>Rule Name</Label>
                <Input
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingRule.description || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={editingRule.discountType}
                  onValueChange={(value) => setEditingRule({ ...editingRule, discountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  value={editingRule.discountValue}
                  onChange={(e) => setEditingRule({ ...editingRule, discountValue: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={editingRule.category || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  value={editingRule.tags || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, tags: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Input
                  type="number"
                  value={editingRule.priority}
                  onChange={(e) => setEditingRule({ ...editingRule, priority: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editingRule.isActive ? 'active' : 'inactive'}
                  onValueChange={(value) => setEditingRule({ ...editingRule, isActive: value === 'active' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRule(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{ruleToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (ruleToDelete) {
                  await onDelete(ruleToDelete.id)
                  setIsDeleteDialogOpen(false)
                  setRuleToDelete(null)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}