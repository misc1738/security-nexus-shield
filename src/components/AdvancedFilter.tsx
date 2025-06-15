
import React, { useState } from 'react';
import { Filter, X, Plus, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface AdvancedFilterProps {
  onFiltersChange: (filters: FilterRule[]) => void;
  availableFields: { value: string; label: string }[];
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ onFiltersChange, availableFields }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [newFilter, setNewFilter] = useState({
    field: '',
    operator: '',
    value: ''
  });

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'between', label: 'Between' }
  ];

  const addFilter = () => {
    if (!newFilter.field || !newFilter.operator || !newFilter.value) return;

    const fieldLabel = availableFields.find(f => f.value === newFilter.field)?.label || newFilter.field;
    const operatorLabel = operators.find(o => o.value === newFilter.operator)?.label || newFilter.operator;
    
    const filter: FilterRule = {
      id: Date.now().toString(),
      field: newFilter.field,
      operator: newFilter.operator,
      value: newFilter.value,
      label: `${fieldLabel} ${operatorLabel} "${newFilter.value}"`
    };

    const updatedFilters = [...filters, filter];
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
    
    setNewFilter({ field: '', operator: '', value: '' });
  };

  const removeFilter = (id: string) => {
    const updatedFilters = filters.filter(f => f.id !== id);
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearAllFilters = () => {
    setFilters([]);
    onFiltersChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle and Active Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="border-slate-600 text-slate-300 hover:text-white"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
          {filters.length > 0 && (
            <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500">
              {filters.length}
            </Badge>
          )}
        </Button>

        {filters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-slate-400 hover:text-white"
          >
            Clear All
          </Button>
        )}

        {/* Active Filter Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <Badge
              key={filter.id}
              className="bg-slate-700 text-slate-200 border-slate-600 pr-1"
            >
              {filter.label}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFilter(filter.id)}
                className="h-4 w-4 p-0 ml-1 hover:bg-slate-600"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Filter Builder */}
      {isOpen && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={newFilter.field} onValueChange={(value) => setNewFilter(prev => ({ ...prev, field: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {availableFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newFilter.operator} onValueChange={(value) => setNewFilter(prev => ({ ...prev, operator: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {operators.map((operator) => (
                      <SelectItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Value"
                  value={newFilter.value}
                  onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />

                <Button
                  onClick={addFilter}
                  disabled={!newFilter.field || !newFilter.operator || !newFilter.value}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Filter
                </Button>
              </div>

              {filters.length > 0 && (
                <div className="pt-4 border-t border-slate-700">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Active Filters:</h4>
                  <div className="space-y-2">
                    {filters.map((filter) => (
                      <div key={filter.id} className="flex items-center justify-between p-2 rounded bg-slate-700/50">
                        <span className="text-sm text-slate-200">{filter.label}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFilter(filter.id)}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFilter;
