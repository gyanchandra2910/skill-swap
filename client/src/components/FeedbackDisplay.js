import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

const FeedbackDisplay = ({ userId, showHeader = true }) => {
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchFeedback();
  }, [userId, currentPage]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/feedback/${userId}?page=${currentPage}&limit=5`
      );
      
      if (response.data.success) {
        setFeedbackData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-success';
    if (rating >= 3) return 'text-warning';
    return 'text-danger';
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading feedback...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  if (!feedbackData) {
    return null;
  }

  const { feedbacks, stats, pagination } = feedbackData;

  return (
    <div className="feedback-display">
      {showHeader && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="bi bi-star-fill me-2"></i>
                  User Ratings & Reviews
                </h5>
              </div>
              
              <div className="card-body">
                {stats.totalFeedbacks > 0 ? (
                  <div className="row">
                    {/* Overall Rating */}
                    <div className="col-md-4 text-center mb-3">
                      <div className="display-4 fw-bold text-warning mb-2">
                        {stats.averageRating}
                      </div>
                      <div className="mb-2">
                        <StarRating value={Math.round(stats.averageRating)} readOnly size="lg" />
                      </div>
                      <div className="text-muted">
                        Based on {stats.totalFeedbacks} review{stats.totalFeedbacks !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="col-md-8">
                      <h6 className="mb-3">Rating Breakdown</h6>
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = stats.ratingBreakdown[star] || 0;
                        const percentage = stats.totalFeedbacks > 0 ? 
                          (count / stats.totalFeedbacks) * 100 : 0;
                        
                        return (
                          <div key={star} className="d-flex align-items-center mb-2">
                            <span className="me-2 text-nowrap">
                              {star} <i className="bi bi-star-fill text-warning"></i>
                            </span>
                            <div className="progress flex-grow-1 me-2" style={{ height: '20px' }}>
                              <div
                                className="progress-bar bg-warning"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-muted" style={{ minWidth: '40px' }}>
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-chat-quote display-4 mb-3"></i>
                    <p>No reviews yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Reviews */}
      {feedbacks.length > 0 && (
        <div className="row">
          <div className="col-12">
            <h6 className="mb-3">Recent Reviews</h6>
            
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      {feedback.fromUserId.profilePhoto ? (
                        <img
                          src={feedback.fromUserId.profilePhoto}
                          alt={feedback.fromUserId.name}
                          className="rounded-circle me-3"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <span className="fw-bold">
                            {feedback.fromUserId.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <h6 className="mb-1">{feedback.fromUserId.name}</h6>
                        <div className="d-flex align-items-center">
                          <StarRating value={feedback.rating} readOnly size="sm" />
                          <span className={`ms-2 fw-bold ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <small className="text-muted">
                      {formatDate(feedback.createdAt)}
                    </small>
                  </div>

                  <p className="mb-3">{feedback.comment}</p>

                  {feedback.swapId && (
                    <div className="d-flex align-items-center text-muted small">
                      <i className="bi bi-arrow-left-right me-2"></i>
                      <span className="badge bg-light text-dark me-2">
                        {feedback.swapId.skillOffered}
                      </span>
                      <span>for</span>
                      <span className="badge bg-light text-dark ms-2">
                        {feedback.swapId.skillWanted}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <li
                      key={index + 1}
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}

      {feedbacks.length === 0 && stats.totalFeedbacks === 0 && (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-chat-quote display-2 mb-3"></i>
          <h5>No reviews yet</h5>
          <p>Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;
