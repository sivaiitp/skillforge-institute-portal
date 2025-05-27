
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, User, X } from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface UserSearchFormProps {
  searchName: string;
  setSearchName: (name: string) => void;
  selectedUser: User | null;
  isSearching: boolean;
  onSearchUser: () => void;
  onClearUser: () => void;
}

const UserSearchForm = ({
  searchName,
  setSearchName,
  selectedUser,
  isSearching,
  onSearchUser,
  onClearUser,
}: UserSearchFormProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchUser();
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Search className="w-4 h-4" />
        Search User by Name
      </Label>
      
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter user name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button
          type="button"
          onClick={onSearchUser}
          disabled={isSearching || !searchName.trim()}
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

      {selectedUser && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedUser.full_name}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                <p className="text-xs text-blue-600 font-medium capitalize">{selectedUser.role}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearUser}
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

export default UserSearchForm;
