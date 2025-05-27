
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
      console.log('Selected user changed, fetching enrollments for:', selectedUser.id);
      fetchUserEnrollments(selectedUser.id);
    } else {
      console.log('No user selected, clearing enrollments');
      setEnrolledCourses([]);
    }
  }, [selectedUser, fetchUserEnrollments, setEnrolledCourses]);

  const issueCertificate = async () => {
    console.log('Issuing certificate for:', { selectedUser: selectedUser?.full_name, selectedCourse });
    const success = await generateCertificate(selectedUser, selectedCourse, enrolledCourses);
    if (success) {
      clearForm();
    }
    return success;
  };

  const clearForm = () => {
    console.log('Clearing form');
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
