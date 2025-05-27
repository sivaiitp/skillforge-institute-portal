
import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import AdminSidebar from '@/components/AdminSidebar';
import CourseForm from '@/components/CourseForm';
import CourseTable from '@/components/CourseTable';
import CourseManagementHeader from '@/components/CourseManagementHeader';
import { useCourseManagement } from '@/hooks/useCourseManagement';

const CourseManagement = () => {
  const { userRole } = useAuth();
  const {
    courses,
    showForm,
    editingCourse,
    loading,
    formData,
    setFormData,
    setShowForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  } = useCourseManagement();

  const courseCategories = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'Database Management',
    'UI/UX Design',
    'Digital Marketing',
    'Project Management'
  ];

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <CourseManagementHeader 
            courses={courses}
            loading={loading}
            onAddCourse={() => setShowForm(true)}
          />

          {showForm && (
            <div className="mb-6">
              <CourseForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                editingCourse={editingCourse}
                courseCategories={courseCategories}
              />
            </div>
          )}

          <CourseTable
            courses={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
