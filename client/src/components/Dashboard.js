import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [navigate]);

  const calculateProfileCompletion = () => {
    if (!user) return 0;

    const fields = [
      !!user.name,
      !!user.email,
      !!user.location,
      !!user.profilePhoto,
      user.skillsOffered?.length > 0,
      user.skillsWanted?.length > 0
    ];

    const completedFields = fields.filter(field => field).length;
    return Math.round((completedFields / fields.length) * 100);
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

  return (
    <div className="row">
      {/* Welcome Section */}
      <div className="col-12 mb-4">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="me-3">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <span className="h4 mb-0">{user?.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="mb-1">Welcome back, {user?.name}!</h4>
                <p className="mb-0">
                  <i className="bi bi-geo-alt me-1"></i>
                  {user?.location || 'Location not set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Profile Completion</h5>
            <div className="progress mb-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${calculateProfileCompletion()}%` }}
                aria-valuenow={calculateProfileCompletion()}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {calculateProfileCompletion()}%
              </div>
            </div>
            <Link to="/profile" className="btn btn-outline-primary btn-sm">
              Complete Your Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Skills You Offer</h5>
            {user?.skillsOffered && user.skillsOffered.length > 0 ? (
              <div className="d-flex flex-wrap gap-1">
                {user.skillsOffered.map((skill, index) => (
                  <span key={index} className="badge bg-primary">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted">
                No skills added yet.
                <Link to="/profile" className="d-block">Add skills you can teach</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Skills You Want</h5>
            {user?.skillsWanted && user.skillsWanted.length > 0 ? (
              <div className="d-flex flex-wrap gap-1">
                {user.skillsWanted.map((skill, index) => (
                  <span key={index} className="badge bg-success">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted">
                No skills added yet.
                <Link to="/profile" className="d-block">Add skills you want to learn</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Find Skills</h5>
            <p className="card-text">
              Search for people who can teach you the skills you want to learn.
            </p>
            <Link to="/search" className="btn btn-primary">
              Search Skills
            </Link>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Update Availability</h5>
            <p className="card-text">
              Current Status: <span className="badge bg-success">{user?.availability}</span>
            </p>
            <Link to="/profile" className="btn btn-outline-primary">
              Update Status
            </Link>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-light">
            <h5 className="mb-0">Account Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Member Since:</strong>{' '}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'Not available'}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Profile Visibility:</strong>{' '}
                  <span className={`badge ${user?.isPublic ? 'bg-success' : 'bg-warning'}`}>
                    {user?.isPublic ? 'Public' : 'Private'}
                  </span>
                </p>
                <p>
                  <strong>Last Updated:</strong>{' '}
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;