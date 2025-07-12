import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import TagInput from './TagInput';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm();

  const watchedValues = watch();

  useEffect(() => {
    // Get user data from localStorage and API
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Set form values
        setValue('name', parsedUser.name || '');
        setValue('location', parsedUser.location || '');
        setValue('profilePhoto', parsedUser.profilePhoto || '');
        setValue('availability', parsedUser.availability || 'available');
        setValue('isPublic', parsedUser.isPublic !== undefined ? parsedUser.isPublic : true);
        setValue('skillsOffered', parsedUser.skillsOffered || []);
        setValue('skillsWanted', parsedUser.skillsWanted || []);
        
        if (parsedUser.profilePhoto) {
          setPreviewImage(parsedUser.profilePhoto);
        }
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to a cloud service like Cloudinary or AWS S3
      // For now, we'll create a local preview and simulate a URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setValue('profilePhoto', reader.result); // In real app, this would be the uploaded URL
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to update your profile');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        {
          name: data.name,
          location: data.location,
          profilePhoto: data.profilePhoto,
          skillsOffered: data.skillsOffered,
          skillsWanted: data.skillsWanted,
          availability: data.availability,
          isPublic: data.isPublic
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage('Profile updated successfully!');
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Access Denied</h4>
            <p>Please login to access your profile.</p>
            <hr />
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-4 mb-4 rounded-3">
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-5 fw-bold mb-3">
                <i className="bi bi-person-gear me-2"></i>
                Edit Your Profile
              </h1>
              <p className="lead mb-0">
                Update your information and skills to connect with the right people
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
              <h4 className="mb-0 text-primary">
                <i className="bi bi-person-circle me-2"></i>
                Profile Settings
              </h4>
              <Link to="/dashboard" className="btn btn-outline-primary">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Dashboard
              </Link>
            </div>
            <div className="card-body p-4">
              {message && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {message}
                  <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                {/* Profile Photo Section */}
                <div className="col-md-12 mb-4">
                  <div className="text-center">
                    <div className="mb-3">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile"
                          className="rounded-circle"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center text-white"
                          style={{ width: '120px', height: '120px' }}
                        >
                          <span className="h2 mb-0">{user.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="profilePhoto" className="btn btn-outline-primary">
                        <i className="bi bi-camera"></i> Change Photo
                      </label>
                      <input
                        type="file"
                        id="profilePhoto"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="d-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Basic Information */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    {...register('name', { 
                      required: 'Name is required',
                      maxLength: { value: 50, message: 'Name cannot exceed 50 characters' }
                    })}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name.message}</div>
                  )}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={user.email}
                    disabled
                  />
                  <div className="form-text">Email cannot be changed</div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                    id="location"
                    placeholder="City, State/Country"
                    {...register('location', {
                      maxLength: { value: 100, message: 'Location cannot exceed 100 characters' }
                    })}
                  />
                  {errors.location && (
                    <div className="invalid-feedback">{errors.location.message}</div>
                  )}
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="availability" className="form-label">
                    Availability Status
                  </label>
                  <select
                    className="form-select"
                    id="availability"
                    {...register('availability')}
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
              
              {/* Skills Section */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Skills You Can Teach
                  </label>
                  <TagInput
                    value={watchedValues.skillsOffered || []}
                    onChange={(tags) => setValue('skillsOffered', tags)}
                    placeholder="Add skills you can teach (e.g., JavaScript, Photography)"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Skills You Want to Learn
                  </label>
                  <TagInput
                    value={watchedValues.skillsWanted || []}
                    onChange={(tags) => setValue('skillsWanted', tags)}
                    placeholder="Add skills you want to learn (e.g., Python, Cooking)"
                  />
                </div>
              </div>
              
              {/* Privacy Settings */}
              <div className="row">
                <div className="col-12 mb-4">
                  <div className="card bg-light">
                    <div className="card-header">
                      <h6 className="mb-0">Privacy Settings</h6>
                    </div>
                    <div className="card-body">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isPublic"
                          {...register('isPublic')}
                        />
                        <label className="form-check-label" htmlFor="isPublic">
                          <strong>Make my profile public</strong>
                        </label>
                      </div>
                      <div className="form-text">
                        When enabled, other users can discover your profile and see your skills. 
                        You'll appear in search results and skill browsing.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary me-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-1"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <Link to="/dashboard" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
                
                <div className="text-muted small">
                  Last updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Never'}
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Live Preview */}
        <div className="card mt-4">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">
              <i className="bi bi-eye me-2"></i>
              Profile Preview
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 text-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="rounded-circle mb-2"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-2"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <span className="h4 mb-0">{watchedValues.name?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                )}
                <h6>{watchedValues.name || user.name}</h6>
                <p className="text-muted small">{watchedValues.location || 'Location not specified'}</p>
                <span className={`badge ${
                  (watchedValues.availability || user.availability) === 'available' ? 'bg-success' :
                  (watchedValues.availability || user.availability) === 'busy' ? 'bg-warning' : 'bg-danger'
                }`}>
                  {watchedValues.availability || user.availability}
                </span>
              </div>
              <div className="col-md-9">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-primary">
                      <i className="bi bi-mortarboard me-1"></i>
                      Skills Offered:
                    </h6>
                    {(watchedValues.skillsOffered || []).length > 0 ? (
                      <div>
                        {(watchedValues.skillsOffered || []).map((skill, index) => (
                          <span key={index} className="badge bg-primary me-1 mb-1">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No skills listed</span>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <h6 className="text-success">
                      <i className="bi bi-lightbulb me-1"></i>
                      Skills Wanted:
                    </h6>
                    {(watchedValues.skillsWanted || []).length > 0 ? (
                      <div>
                        {(watchedValues.skillsWanted || []).map((skill, index) => (
                          <span key={index} className="badge bg-success me-1 mb-1">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No skills listed</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-2">
                  <small className="text-muted">
                    Profile visibility: {watchedValues.isPublic !== undefined ? 
                      (watchedValues.isPublic ? 'Public' : 'Private') : 
                      (user.isPublic ? 'Public' : 'Private')
                    }
                  </small>
                </div>
              </div>              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
