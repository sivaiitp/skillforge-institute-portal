
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Sparkles } from "lucide-react";

interface ProfileHeaderProps {
  editing: boolean;
  setEditing: (editing: boolean) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export const ProfileHeader = ({ editing, setEditing, handleSave, handleCancel }: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-violet-100">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" />
          Edit Your Profile
        </h3>
        <p className="text-gray-600">Keep your information up to date for the best learning experience</p>
      </div>
      {!editing ? (
        <Button 
          onClick={() => setEditing(true)}
          className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white px-6 py-2"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="border-gray-300 hover:bg-gray-50 px-6 py-2"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
