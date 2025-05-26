
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useProfileData } from "@/hooks/useProfileData";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BasicInfoCard } from "@/components/profile/BasicInfoCard";
import { AddressCard } from "@/components/profile/AddressCard";
import { EducationCard } from "@/components/profile/EducationCard";
import { ProfessionalCard } from "@/components/profile/ProfessionalCard";

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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 relative">
        <SidebarProvider>
          <div className="flex h-full w-full">
            <SidebarInset className="flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold">My Profile</h1>
              </header>
              
              <div className="p-6 space-y-6">
                <ProfileHeader
                  editing={editing}
                  setEditing={setEditing}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                />

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading profile...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            </SidebarInset>
            <div className="relative">
              <StudentSidebar />
            </div>
          </div>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentProfile;
