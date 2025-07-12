import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    skillsOffered: '',
    skillsWanted: '',
    availability: 'available',
    isPublic: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        location: parsedUser.location || '',
        skillsOffered: parsedUser.skillsOffered?.join(', ') || '',
        skillsWanted: parsedUser.skillsWanted?.join(', ') || '',
        availability: parsedUser.availability || 'available',
        isPublic: parsedUser.isPublic !== undefined ? parsedUser.isPublic : true
      });
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    // Prepare data for API (when profile update endpoint is available)
    const updateData = {
      name: formData.name,
      location: formData.location,
      skillsOffered: formData.skillsOffered.split(',').map(skill => skill.trim()).filter(skill => skill),
      skillsWanted: formData.skillsWanted.split(',').map(skill => skill.trim()).filter(skill => skill),
      availability: formData.availability,
      isPublic: formData.isPublic
    };

    try {
      // For now, just simulate an update by updating localStorage
      // In a real app, you'd make an API call here
      const updatedUser = { ...user, ...updateData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage('Profile updated successfully!');
      
      // TODO: Replace with actual API call when backend route is available
      // const token = localStorage.getItem('token');
      // const response = await fetch('http://localhost:5000/api/users/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(updateData),
      // });
      
    } catch (err) {
      setError('Failed to update profile. Please try again.');
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
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Your Profile</h4>
            <Link to="/dashboard" className="btn btn-outline-light btn-sm">
              Back to Dashboard
            </Link>
          </div>
          <div className="card-body">
            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
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
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State/Country"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="availability" className="form-label">
                    Availability
                  </label>
                  <select
                    className="form-select"
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="skillsOffered" className="form-label">
                  Skills You Can Teach
                </label>
                <textarea
                  className="form-control"
                  id="skillsOffered"
                  name="skillsOffered"
                  rows="3"
                  value={formData.skillsOffered}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Photography (comma-separated)"
                />
                <div className="form-text">Enter skills separated by commas</div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="skillsWanted" className="form-label">
                  Skills You Want to Learn
                </label>
                <textarea
                  className="form-control"
                  id="skillsWanted"
                  name="skillsWanted"
                  rows="3"
                  value={formData.skillsWanted}
                  onChange={handleChange}
                  placeholder="Python, Cooking, Guitar (comma-separated)"
                />
                <div className="form-text">Enter skills separated by commas</div>
              </div>
              
              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isPublic">
                    Make my profile public
                  </label>
                  <div className="form-text">
                    When enabled, other users can see your profile and skills
                  </div>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                
                <Link to="/dashboard" className="btn btn-outline-secondary">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        {/* Profile Preview */}
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="mb-0">Profile Preview</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="text-center">
                  <div className="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center text-white" style={{width: '80px', height: '80px'}}>
                    <span className="h3 mb-0">{user.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <h5 className="mt-2">{user.name}</h5>
                  <p className="text-muted">{user.location || 'Location not specified'}</p>
                  <span className={`badge ${
                    user.availability === 'available' ? 'bg-success' :
                    user.availability === 'busy' ? 'bg-warning' : 'bg-danger'
                  }`}>
                    {user.availability}
                  </span>
                </div>
              </div>
              <div className="col-md-8">
                <div className="mb-3">
                  <h6>Skills Offered:</h6>
                  {user.skillsOffered && user.skillsOffered.length > 0 ? (
                    user.skillsOffered.map((skill, index) => (
                      <span key={index} className="badge bg-primary me-1 mb-1">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">No skills listed</span>
                  )}
                </div>
                <div>
                  <h6>Skills Wanted:</h6>
                  {user.skillsWanted && user.skillsWanted.length > 0 ? (
                    user.skillsWanted.map((skill, index) => (
                      <span key={index} className="badge bg-success me-1 mb-1">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">No skills listed</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
