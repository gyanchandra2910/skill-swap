import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackDisplay from './FeedbackDisplay';

const UserProfile = ({ user, onClose, onRequestSwap }) => {
  const [feedback, setFeedback] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      fetchUserFeedback();
    }
  }, [user]);

  const fetchUserFeedback = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/feedback/${user._id}`);
      if (response.data.success) {
        setFeedback(response.data.feedback);
        setAverageRating(response.data.averageRating || 0);
        setTotalReviews(response.data.totalReviews || 0);
      }
    } catch (error) {
      console.error('Error fetching user feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = () => {
    if (onRequestSwap) {
      onRequestSwap(user);
    }
    onClose();
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${i <= rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-circle me-2"></i>
              {user.name}'s Profile
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* User Header */}
            <div className="row mb-4">
              <div className="col-md-3 text-center">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="rounded-circle mb-3"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-3"
                    style={{ width: '120px', height: '120px', fontSize: '3rem' }}
                  >
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="text-center">
                  <span className={`badge ${
                    user.availability === 'available' ? 'bg-success' :
                    user.availability === 'busy' ? 'bg-warning' : 'bg-danger'
                  } fs-6`}>
                    {user.availability}
                  </span>
                </div>
              </div>
              
              <div className="col-md-9">
                <h3 className="mb-2">{user.name}</h3>
                
                {/* Rating */}
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="text-muted">
                      {averageRating > 0 ? (
                        <>
                          {averageRating.toFixed(1)} out of 5 ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                        </>
                      ) : (
                        'No reviews yet'
                      )}
                    </span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong><i className="bi bi-geo-alt me-1"></i> Location:</strong><br />
                      {user.location || 'Not specified'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong><i className="bi bi-calendar me-1"></i> Member since:</strong><br />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0">
                      <i className="bi bi-mortarboard me-2"></i>
                      Skills {user.name} Can Teach
                    </h6>
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
                      <p className="text-muted mb-0">No skills listed</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0">
                      <i className="bi bi-lightbulb me-2"></i>
                      Skills {user.name} Wants to Learn
                    </h6>
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
                      <p className="text-muted mb-0">No skills listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className="bi bi-chat-square-text me-2"></i>
                      Reviews & Feedback
                    </h6>
                  </div>
                  <div className="card-body">
                    {loading ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : feedback.length > 0 ? (
                      <FeedbackDisplay 
                        feedback={feedback} 
                        averageRating={averageRating}
                        totalReviews={totalReviews}
                      />
                    ) : (
                      <div className="text-center py-4 text-muted">
                        <i className="bi bi-chat-square display-4 mb-3"></i>
                        <p>No reviews yet</p>
                        <small>Be the first to leave feedback after a skill swap!</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleRequestSwap}
            >
              <i className="bi bi-arrow-left-right me-1"></i>
              Request Skill Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
