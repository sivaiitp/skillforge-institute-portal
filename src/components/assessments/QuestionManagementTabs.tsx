
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Upload, Users, BookOpen } from 'lucide-react';

interface QuestionManagementTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const QuestionManagementTabs = ({ activeTab, onTabChange }: QuestionManagementTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-5 bg-white border rounded-lg p-1">
      <TabsTrigger value="questions" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Questions
      </TabsTrigger>
      <TabsTrigger value="single" className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Single Question
      </TabsTrigger>
      <TabsTrigger value="bulk" className="flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Bulk Questions
      </TabsTrigger>
      <TabsTrigger value="assign" className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        Assign Existing
      </TabsTrigger>
      <TabsTrigger value="bank" className="flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        Question Bank
      </TabsTrigger>
    </TabsList>
  );
};

export default QuestionManagementTabs;
