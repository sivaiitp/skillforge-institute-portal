
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { useProfileData } from "@/hooks/useProfileData";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BasicInfoCard } from "@/components/profile/BasicInfoCard";
import { AddressCard } from "@/components/profile/AddressCard";
import { EducationCard } from "@/components/profile/EducationCard";
import { ProfessionalCard } from "@/components/profile/ProfessionalCard";
import { User } from "lucide-react";

const StudentProfile = () => {
  const {
    profile,
    loading,
    editing,
    formData,
    setEditing,
    setFormData,
    handleSave,
    handleCancel,
    user
  } = useProfileData();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <StudentSidebar />
          
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Profile
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                <ProfileHeader
                  editing={editing}
                  setEditing={setEditing}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                />

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading profile...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <BasicInfoCard
                      editing={editing}
                      formData={formData}
                      setFormData={setFormData}
                      profile={profile}
                      userEmail={user?.email || ''}
                    />

                    <AddressCard
                      editing={editing}
                      formData={formData}
                      setFormData={setFormData}
                      profile={profile}
                    />

                    <EducationCard
                      editing={editing}
                      formData={formData}
                      setFormData={setFormData}
                      profile={profile}
                    />

                    <ProfessionalCard
                      editing={editing}
                      formData={formData}
                      setFormData={setFormData}
                      profile={profile}
                    />
                  </div>
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudentProfile;
