import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const DataTable = ({ 
  data = [], 
  columns = [], 
  onEdit, 
  onDelete, 
  className 
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

const renderCellValue = (item, column) => {
    let value = item[column.key];
    
    // Handle lookup fields that might be objects
    if (value && typeof value === 'object' && value.Name !== undefined) {
      value = value.Name;
    }
    
    if (column.render) {
      return column.render(value, item);
    }
    
    if (column.type === "date") {
      return value ? new Date(value).toLocaleDateString() : "";
    }
    
    if (column.type === "badge") {
      return <Badge variant={column.getBadgeVariant?.(value) || "default"}>{value}</Badge>;
    }
    
return value || "";
  };
  return (
    <div className={cn("glass-card rounded-xl overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-750/50 border-b border-slate-600">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={cn(
                    "px-6 py-4 text-left text-sm font-semibold text-gray-200",
                    column.sortable && "cursor-pointer hover:text-white"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <ApperIcon 
                        name={
                          sortField === column.key 
                            ? sortDirection === "asc" ? "ChevronUp" : "ChevronDown"
                            : "ChevronsUpDown"
                        } 
                        className="h-4 w-4" 
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {sortedData.map((item) => (
              <tr key={item.Id} className="hover:bg-slate-750/30 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-300">
                    {renderCellValue(item, column)}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDelete(item)}
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;