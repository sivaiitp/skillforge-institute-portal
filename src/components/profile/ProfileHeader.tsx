
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface ProfileHeaderProps {
  editing: boolean;
  setEditing: (editing: boolean) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export const ProfileHeader = ({ editing, setEditing, handleSave, handleCancel }: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>
      {!editing ? (
        <Button onClick={() => setEditing(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
