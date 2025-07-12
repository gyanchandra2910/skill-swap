import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
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
            <p>Please login to access your dashboard.</p>
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
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white p-4 rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">Welcome back, {user.name}!</h2>
                <p className="mb-0">Ready to share and learn new skills?</p>
              </div>
              <div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Skills You Offer</h5>
              <h2 className="display-6">{user.skillsOffered?.length || 0}</h2>
              <p className="card-text">Skills you can teach</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Skills You Want</h5>
              <h2 className="display-6">{user.skillsWanted?.length || 0}</h2>
              <p className="card-text">Skills you want to learn</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title text-info">Availability</h5>
              <h4 className="text-capitalize">
                <span className={`badge ${
                  user.availability === 'available' ? 'bg-success' :
                  user.availability === 'busy' ? 'bg-warning' : 'bg-danger'
                }`}>
                  {user.availability}
                </span>
              </h4>
              <p className="card-text">Current status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Your Profile</h5>
              <Link to="/profile" className="btn btn-sm btn-outline-primary">
                Edit Profile
              </Link>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Location:</strong> {user.location || 'Not specified'}</p>
                  <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Profile Visibility:</strong> {user.isPublic ? 'Public' : 'Private'}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary">
                  Find Skills to Learn
                </button>
                <button className="btn btn-outline-primary">
                  Browse Teachers
                </button>
                <button className="btn btn-outline-secondary">
                  View My Connections
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Skills You Offer</h5>
            </div>
            <div className="card-body">
              {user.skillsOffered && user.skillsOffered.length > 0 ? (
                <div>
                  {user.skillsOffered.map((skill, index) => (
                    <span key={index} className="badge bg-primary me-2 mb-2">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No skills added yet. Add skills you can teach!</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Skills You Want to Learn</h5>
            </div>
            <div className="card-body">
              {user.skillsWanted && user.skillsWanted.length > 0 ? (
                <div>
                  {user.skillsWanted.map((skill, index) => (
                    <span key={index} className="badge bg-success me-2 mb-2">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No skills added yet. Add skills you want to learn!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
