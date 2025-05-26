
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, User, X } from 'lucide-react';

interface Student {
  id: string;
  full_name: string;
  email: string;
}

interface StudentSearchSectionProps {
  searchEmail: string;
  setSearchEmail: (email: string) => void;
  selectedStudent: Student | null;
  searchResults: Student[];
  isSearching: boolean;
  onSearchStudent: () => void;
  onSelectStudent: (student: Student) => void;
  onClearStudent: () => void;
}

const StudentSearchSection = ({
  searchEmail,
  setSearchEmail,
  selectedStudent,
  searchResults,
  isSearching,
  onSearchStudent,
  onSelectStudent,
  onClearStudent,
}: StudentSearchSectionProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchStudent();
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Search className="w-4 h-4" />
        Search Student by Email
      </Label>
      
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter part of student email address..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button
          type="button"
          onClick={onSearchStudent}
          disabled={isSearching || !searchEmail.trim()}
          className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && !selectedStudent && (
        <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">
              Found {searchResults.length} student{searchResults.length > 1 ? 's' : ''}
            </p>
          </div>
          {searchResults.map((student) => (
            <div
              key={student.id}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => onSelectStudent(student)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{student.full_name}</p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Student */}
      {selectedStudent && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedStudent.full_name}</p>
                <p className="text-sm text-gray-600">{selectedStudent.email}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearStudent}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSearchSection;
