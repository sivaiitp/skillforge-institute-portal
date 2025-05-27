
import { useState, useEffect } from 'react';
import { useUserSearch } from './useUserSearch';
import { useUserEnrollments } from './useUserEnrollments';
import { useCertificateGeneration } from './useCertificateGeneration';

export const useCertificateIssuing = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const {
    searchName,
    setSearchName,
    selectedUser,
    setSelectedUser,
    isSearching,
    searchUsers,
    clearUser,
  } = useUserSearch();

  const {
    enrolledCourses,
    setEnrolledCourses,
    loadingEnrollments,
    fetchUserEnrollments,
  } = useUserEnrollments();

  const {
    isIssuingCertificate,
    issueCertificate: generateCertificate,
  } = useCertificateGeneration();

  // Fetch enrollments when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchUserEnrollments(selectedUser.id);
    } else {
      setEnrolledCourses([]);
    }
  }, [selectedUser, fetchUserEnrollments, setEnrolledCourses]);

  const issueCertificate = async () => {
    const success = await generateCertificate(selectedUser, selectedCourse, enrolledCourses);
    if (success) {
      clearForm();
    }
    return success;
  };

  const clearForm = () => {
    clearUser();
    setEnrolledCourses([]);
    setSelectedCourse('');
  };

  return {
    searchName,
    setSearchName,
    selectedUser,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    selectedCourse,
    setSelectedCourse,
    isIssuingCertificate,
    searchUsers,
    issueCertificate,
    clearForm,
  };
};
