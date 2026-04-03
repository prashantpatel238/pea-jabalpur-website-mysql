
import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, FileJson, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/exportUtils';

const ExportButton = ({ 
  filteredMembers, 
  directoryConfig, 
  customFields,
  disabled = false
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    if (!filteredMembers || filteredMembers.length === 0) {
      toast.error('No members to export');
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading(`Generating ${format.toUpperCase()} export...`);

    try {
      // Small delay to allow UI to update loading state before heavy processing
      await new Promise(resolve => setTimeout(resolve, 100));

      switch (format) {
        case 'csv':
          exportToCSV(filteredMembers, directoryConfig, customFields);
          break;
        case 'xlsx':
          exportToExcel(filteredMembers, directoryConfig, customFields);
          break;
        case 'pdf':
          exportToPDF(filteredMembers, directoryConfig, customFields);
          break;
        default:
          throw new Error('Unsupported format');
      }

      toast.success(`${format.toUpperCase()} export completed successfully`, { id: toastId });
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to generate ${format.toUpperCase()} export`, { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled || isExporting || filteredMembers.length === 0}
          className="bg-background border-muted shadow-sm"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport('xlsx')} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
          <span>Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
          <FileJson className="w-4 h-4 mr-2 text-blue-600" />
          <span>CSV (.csv)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2 text-red-600" />
          <span>PDF Document</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
