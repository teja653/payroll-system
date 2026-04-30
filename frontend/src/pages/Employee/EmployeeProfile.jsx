import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Employee/EmployeeProfile.module.css';
import Sidebar from './EmployeeSidebar';

const EmployeeProfile = () => {
  // State for the current profile data being edited
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    department: '',
    role: '',
  });
  // State to keep track of the original profile data
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employee/profile', {
          withCredentials: true,
        });
        setProfileData(response.data);
        setOriginalData(response.data); // Store the original data
      } catch (error) {
        setMessage({ text: 'Error fetching profile data', type: 'error' });
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = (e) => {
    e.preventDefault();
    if (isEditing) {
      // If we're exiting edit mode without saving, reset to original data
      setProfileData({ ...originalData });
    }
    setIsEditing((prev) => !prev);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting profile data:', profileData);

    try {
      const response = await axios.put('http://localhost:5000/api/employee/profile', profileData, {
        withCredentials: true,
      });
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      console.log('Response from server:', response.data);
      setOriginalData(profileData); // Update original data after successful save
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Error updating profile. Please try again.', type: 'error' });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setProfileData({ ...originalData }); // Reset to original data
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1>Employee Profile</h1>
        {message && (
          <p className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
            {message.text}
          </p>
        )}
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          {Object.entries(profileData).map(([key, value]) => (
            <div key={key} className={styles.profileRow}>
              <label>{key.replace('_', ' ').toUpperCase()}:</label>
              {isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={value || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{value}</p>
              )}
            </div>
          ))}
          <div className={styles.buttonContainer}>
            {isEditing ? (
              <>
                <button type="submit" className={styles.saveButton}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={toggleEditMode}
                className={styles.editButton}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeProfile;