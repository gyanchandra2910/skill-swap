import React, { useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import { toast } from 'react-toastify';

const FeedbackForm = ({ swap, otherUser, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleCommentChange = (e) => {
    const comment = e.target.value;
    setFormData(prev => ({ ...prev, comment }));
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a rating between 1 and 5 stars';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Please provide a comment about your experience';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters long';
    } else if (formData.comment.trim().length > 500) {
      newErrors.comment = 'Comment must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/feedback',
        {
          toUserId: otherUser._id,
          swapId: swap._id,
          rating: formData.rating,
          comment: formData.comment.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Feedback submitted successfully!');
        onSuccess && onSuccess(response.data.feedback);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      const message = error.response?.data?.message || 'Failed to submit feedback';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-chat-quote me-2"></i>
          Rate Your Experience with {otherUser.name}
        </h5>
      </div>
      
      <div className="card-body">
        {/* Swap Details */}
        <div className="mb-4 p-3 bg-light rounded">
          <h6 className="text-muted mb-2">Skill Exchange</h6>
          <div className="d-flex align-items-center">
            <span className="badge bg-primary me-2">{swap.skillOffered}</span>
            <i className="bi bi-arrow-left-right mx-2 text-muted"></i>
            <span className="badge bg-success">{swap.skillWanted}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div className="mb-4">
            <label className="form-label fw-bold">
              Rating <span className="text-danger">*</span>
            </label>
            <div className="d-flex align-items-center mb-2">
              <StarRating
                value={formData.rating}
                onChange={handleRatingChange}
                size="lg"
              />
              {formData.rating > 0 && (
                <span className="ms-3 text-muted">
                  {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {errors.rating && (
              <div className="text-danger small">{errors.rating}</div>
            )}
          </div>

          {/* Comment Section */}
          <div className="mb-4">
            <label htmlFor="comment" className="form-label fw-bold">
              Your Experience <span className="text-danger">*</span>
            </label>
            <textarea
              id="comment"
              className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
              rows={4}
              placeholder="Share your experience with this skill exchange. How was the teaching quality? Communication? Overall experience?"
              value={formData.comment}
              onChange={handleCommentChange}
              maxLength={500}
            />
            <div className="form-text">
              {formData.comment.length}/500 characters
            </div>
            {errors.comment && (
              <div className="invalid-feedback">{errors.comment}</div>
            )}
          </div>

          {/* Guidelines */}
          <div className="alert alert-info">
            <small>
              <i className="bi bi-info-circle me-1"></i>
              <strong>Feedback Guidelines:</strong> Be honest and constructive. 
              Your feedback helps the community grow and helps others make informed decisions.
            </small>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.rating || !formData.comment.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
