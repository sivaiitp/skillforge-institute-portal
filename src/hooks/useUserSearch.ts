
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@/types/certificateIssuing';

export const useUserSearch = () => {
  const [searchName, setSearchName] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchUsers = async () => {
    if (!searchName.trim()) {
      toast.error('Please enter a user name');
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for users with name containing:', searchName.trim());
      
      // Search ALL users in the profiles table - no role filter, no user restriction
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .ilike('full_name', `%${searchName.trim()}%`)
        .order('full_name');

      console.log('Search results:', { users, error, searchTerm: searchName.trim() });

      if (error) {
        console.error('Error searching users:', error);
        toast.error('Error searching for users');
        return;
      }

      if (!users || users.length === 0) {
        toast.error(`No users found with name containing "${searchName.trim()}"`);
        setSelectedUser(null);
        return;
      }

      // If multiple results, take the first one
      const foundUser = users[0];
      console.log('Found user:', foundUser);

      if (users.length > 1) {
        toast.info(`Found ${users.length} users, selected: ${foundUser.full_name}`);
      }

      setSelectedUser(foundUser);
      toast.success(`Found user: ${foundUser.full_name}`);

    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Error searching for users');
      setSelectedUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  const clearUser = () => {
    setSelectedUser(null);
    setSearchName('');
  };

  return {
    searchName,
    setSearchName,
    selectedUser,
    setSelectedUser,
    isSearching,
    searchUsers,
    clearUser,
  };
};
