
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { useProfileData } from "@/hooks/useProfileData";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BasicInfoCard } from "@/components/profile/BasicInfoCard";
import { AddressCard } from "@/components/profile/AddressCard";
import { EducationCard } from "@/components/profile/EducationCard";
import { ProfessionalCard } from "@/components/profile/ProfessionalCard";
import { User, Sparkles, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <StudentSidebar />
          
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  My Profile
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                {/* Enhanced Header Section */}
                <div className="text-center space-y-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-100/20 to-indigo-100/20 rounded-3xl blur-3xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-4 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl shadow-lg">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Profile Information
                      </h2>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Manage your personal information and preferences to enhance your learning experience
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Shield className="h-4 w-4 text-violet-500" />
                      <span className="text-sm text-gray-500">Your information is secure and encrypted</span>
                    </div>
                  </div>
                </div>

                <ProfileHeader
                  editing={editing}
                  setEditing={setEditing}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                />

                {loading ? (
                  <div className="text-center py-20">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-500 mx-auto mb-6"></div>
                      <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-t-2 border-indigo-300 mx-auto mb-6"></div>
                    </div>
                    <p className="text-lg text-gray-600">Loading your profile...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <BasicInfoCard
                        editing={editing}
                        formData={formData}
                        setFormData={setFormData}
                        profile={profile}
                        userEmail={user?.email || ''}
                      />
                    </div>

                    <div className="space-y-8">
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
