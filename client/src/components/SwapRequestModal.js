import React, { useState } from 'react';
import axios from 'axios';

const SwapRequestModal = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to send swap requests');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/swaps',
        {
          receiverId: user._id,
          skillOffered: formData.skillOffered,
          skillWanted: formData.skillWanted,
          message: formData.message
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onSuccess('Swap request sent successfully!');
        onClose();
      } else {
        setError(response.data.message || 'Failed to send swap request');
      }
    } catch (err) {
      console.error('Swap request error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send swap request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-arrow-left-right me-2"></i>
              Request Skill Swap with {user.name}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            {/* User Info */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card bg-light">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name}
                            className="rounded-circle"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white"
                            style={{ width: '50px', height: '50px' }}
                          >
                            <span className="fw-bold">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-1">{user.name}</h6>
                        <p className="text-muted small mb-1">{user.location || 'Location not specified'}</p>
                        <span className={`badge ${
                          user.availability === 'available' ? 'bg-success' :
                          user.availability === 'busy' ? 'bg-warning' : 'bg-danger'
                        }`}>
                          {user.availability}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Skills */}
            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="text-primary">
                  <i className="bi bi-mortarboard me-1"></i>
                  They can teach:
                </h6>
                {user.skillsOffered && user.skillsOffered.length > 0 ? (
                  <div>
                    {user.skillsOffered.map((skill, index) => (
                      <span key={index} className="badge bg-primary me-1 mb-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">No skills listed</span>
                )}
              </div>
              
              <div className="col-md-6">
                <h6 className="text-success">
                  <i className="bi bi-lightbulb me-1"></i>
                  They want to learn:
                </h6>
                {user.skillsWanted && user.skillsWanted.length > 0 ? (
                  <div>
                    {user.skillsWanted.map((skill, index) => (
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

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Swap Request Form */}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="skillOffered" className="form-label">
                    Skill You'll Teach <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="skillOffered"
                    name="skillOffered"
                    value={formData.skillOffered}
                    onChange={handleChange}
                    placeholder="e.g., JavaScript, Photography"
                    required
                  />
                  <div className="form-text">What skill will you teach them?</div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="skillWanted" className="form-label">
                    Skill You Want to Learn <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="skillWanted"
                    name="skillWanted"
                    value={formData.skillWanted}
                    onChange={handleChange}
                    placeholder="e.g., Python, Cooking"
                    required
                  />
                  <div className="form-text">What skill do you want to learn from them?</div>
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message (Optional)
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Introduce yourself and explain why you're interested in this skill swap..."
                  maxLength="500"
                />
                <div className="form-text">
                  {formData.message.length}/500 characters
                </div>
              </div>
              
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-1"></i>
                      Send Swap Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestModal;
