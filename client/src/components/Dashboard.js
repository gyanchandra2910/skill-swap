import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import FeedbackForm from './FeedbackForm';
import ScheduleModal from './ScheduleModal';
import CompletionModal from './CompletionModal';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [swapRequests, setSwapRequests] = useState({
    incoming: [],
    outgoing: []
  });
  const [notification, setNotification] = useState('');
  const [requestsLoading, setRequestsLoading] = useState(false);
  const { socket, connected } = useSocket();
  const [showFeedbackForm, setShowFeedbackForm] = useState(null);
  const [feedbackData, setFeedbackData] = useState({});
  const [showScheduleModal, setShowScheduleModal] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchSwapRequests();
    }
    setLoading(false);
  }, []);

  // Listen for socket events to refresh dashboard
  useEffect(() => {
    if (socket && connected) {
      const handleSwapEvent = (data) => {
        console.log('Dashboard received swap event:', data);
        // Refresh swap requests when any swap-related event occurs
        fetchSwapRequests();
      };

      socket.on('swap_request', handleSwapEvent);

      return () => {
        socket.off('swap_request', handleSwapEvent);
      };
    }
  }, [socket, connected]);

  const fetchSwapRequests = async () => {
    setRequestsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('/api/swaps', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSwapRequests(response.data.swapRequests);
      }
    } catch (error) {
      console.error('Error fetching swap requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleSwapAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.put(
        `/api/swaps/${requestId}/${action}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setNotification(`Swap request ${action}ed successfully!`);
        setTimeout(() => setNotification(''), 5000);
        fetchSwapRequests(); // Refresh the requests
      }
    } catch (error) {
      console.error(`Error ${action}ing swap request:`, error);
      setNotification(`Failed to ${action} swap request. Please try again.`);
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleShowFeedbackForm = (request) => {
    setShowFeedbackForm(request);
  };

  const handleFeedbackSuccess = (feedback) => {
    setShowFeedbackForm(null);
    setNotification('Feedback submitted successfully!');
    setTimeout(() => setNotification(''), 5000);
    
    // Mark this swap as having feedback
    setFeedbackData(prev => ({
      ...prev,
      [showFeedbackForm._id]: true
    }));
  };

  const handleFeedbackCancel = () => {
    setShowFeedbackForm(null);
  };

  const handleCompleteSwap = async (requestId, sessionSummary = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.put(
        `/api/swaps/${requestId}/complete`,
        { sessionSummary },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setNotification(response.data.message);
        setTimeout(() => setNotification(''), 5000);
        fetchSwapRequests(); // Refresh the requests
      }
    } catch (error) {
      console.error('Error completing swap:', error);
      setNotification('Failed to complete swap. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleScheduleSwap = async (requestId, scheduleData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.put(
        `/api/swaps/${requestId}/schedule`,
        scheduleData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setNotification('Session details updated successfully!');
        setTimeout(() => setNotification(''), 5000);
        fetchSwapRequests(); // Refresh the requests
      }
    } catch (error) {
      console.error('Error scheduling swap:', error);
      setNotification('Failed to update session details. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleShowScheduleModal = (request) => {
    setShowScheduleModal(request);
  };

  const handleShowCompletionModal = (request) => {
    setShowCompletionModal(request);
  };

  const handleScheduleSubmit = (scheduleData) => {
    if (showScheduleModal) {
      handleScheduleSwap(showScheduleModal._id, scheduleData);
      setShowScheduleModal(null);
    }
  };

  const handleCompletionSubmit = (sessionSummary) => {
    if (showCompletionModal) {
      handleCompleteSwap(showCompletionModal._id, sessionSummary);
      setShowCompletionModal(null);
    }
  };

  const getOtherUser = (request) => {
    if (!user) return null;
    // If current user is the requester, return the receiver, otherwise return the requester
    return request.requesterId && request.requesterId._id === user._id ? request.receiverId : request.requesterId;
  };

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
      {/* Success/Error Notification */}
      {notification && (
        <div className="row mb-3">
          <div className="col-12">
            <div className={`alert ${notification.includes('Failed') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
              <i className={`bi ${notification.includes('Failed') ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
              {notification}
              <button
                type="button"
                className="btn-close"
                onClick={() => setNotification('')}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Connection Status */}
      <div className="row mb-2">
        <div className="col-12">
          <div className="d-flex justify-content-end">
            <small className={`badge ${connected ? 'bg-success' : 'bg-secondary'}`}>
              <i className={`bi ${connected ? 'bi-wifi' : 'bi-wifi-off'} me-1`}></i>
              {connected ? 'Real-time notifications ON' : 'Offline'}
            </small>
          </div>
        </div>
      </div>

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
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Skills You Offer</h5>
              <h2 className="display-6">{user.skillsOffered?.length || 0}</h2>
              <p className="card-text">Skills you can teach</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Skills You Want</h5>
              <h2 className="display-6">{user.skillsWanted?.length || 0}</h2>
              <p className="card-text">Skills you want to learn</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="card-title text-warning">Pending Requests</h5>
              <h2 className="display-6">
                {(swapRequests.incoming?.filter(req => req.status === 'pending').length || 0) + 
                 (swapRequests.outgoing?.filter(req => req.status === 'pending').length || 0)}
              </h2>
              <p className="card-text">Awaiting action</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
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
                <Link to="/search" className="btn btn-primary">
                  Find Skills to Learn
                </Link>
                <Link to="/search" className="btn btn-outline-primary">
                  Browse Teachers
                </Link>
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

      {/* Swap Requests Section */}
      <div className="row mt-4">
        <div className="col-12">
          <h4 className="mb-3">
            <i className="bi bi-arrow-left-right me-2"></i>
            Swap Requests
          </h4>
        </div>
      </div>

      <div className="row">
        {/* Incoming Requests */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-inbox me-2"></i>
                Incoming Requests
              </h5>
              <span className="badge bg-dark">
                {swapRequests.incoming?.length || 0}
              </span>
            </div>
            <div className="card-body">
              {requestsLoading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : swapRequests.incoming && swapRequests.incoming.length > 0 ? (
                <div className="space-y-3">
                  {swapRequests.incoming.map((request) => {
                    const otherUser = request.requesterId;
                    return (
                    <div key={request._id} className="border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{request.requesterId?.name}</h6>
                          <small className="text-muted">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <span className={`badge ${
                          request.status === 'pending' ? 'bg-warning' :
                          request.status === 'accepted' ? 'bg-success' : 
                          request.status === 'completed' ? 'bg-info' : 'bg-danger'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="d-flex align-items-center mb-1">
                          <span className="badge bg-primary me-2">Offers:</span>
                          <span>{request.skillOffered}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-success me-2">Wants:</span>
                          <span>{request.skillWanted}</span>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mb-2">
                          <small className="text-muted">
                            <i className="bi bi-chat-quote me-1"></i>
                            "{request.message}"
                          </small>
                        </div>
                      )}

                      {request.status === 'pending' && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleSwapAction(request._id, 'accept')}
                          >
                            <i className="bi bi-check me-1"></i>
                            Accept
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleSwapAction(request._id, 'reject')}
                          >
                            <i className="bi bi-x me-1"></i>
                            Reject
                          </button>
                        </div>
                      )}

                      {request.status === 'accepted' && (
                        <div>
                          <div className="text-success small mb-2">
                            <i className="bi bi-check-circle me-1"></i>
                            Swap accepted! Ready to connect.
                          </div>
                          
                          {/* Contact Information */}
                          <div className="card border-success mb-3">
                            <div className="card-header bg-success text-white">
                              <h6 className="mb-0">
                                <i className="bi bi-person-lines-fill me-2"></i>
                                Contact Information
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6">
                                  <strong>Email:</strong>
                                  <br />
                                  <a href={`mailto:${otherUser?.email}`} className="text-decoration-none">
                                    {otherUser?.email}
                                  </a>
                                </div>
                                <div className="col-md-6">
                                  {otherUser?.phone && (
                                    <>
                                      <strong>WhatsApp:</strong>
                                      <br />
                                      <a 
                                        href={`https://wa.me/${otherUser.phone.replace(/\D/g, '')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-decoration-none text-success"
                                      >
                                        <i className="bi bi-whatsapp me-1"></i>
                                        {otherUser.phone}
                                      </a>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Session Time */}
                              {request.sessionTime && (
                                <div className="mt-3 p-2 bg-light rounded">
                                  <strong>Suggested Session Time:</strong>
                                  <br />
                                  <i className="bi bi-calendar-event me-1"></i>
                                  {new Date(request.sessionTime).toLocaleString()}
                                </div>
                              )}
                              
                              {/* Additional Contact Info */}
                              {(request.contactEmail || request.contactPhone) && (
                                <div className="mt-3">
                                  <strong>Additional Contact:</strong>
                                  <br />
                                  {request.contactEmail && (
                                    <div>
                                      <i className="bi bi-envelope me-1"></i>
                                      {request.contactEmail}
                                    </div>
                                  )}
                                  {request.contactPhone && (
                                    <div>
                                      <i className="bi bi-telephone me-1"></i>
                                      {request.contactPhone}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Completion Status */}
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              {request.requesterCompleted && (
                                <span className="badge bg-info me-2">
                                  <i className="bi bi-person-check me-1"></i>
                                  Requester completed
                                </span>
                              )}
                              {request.receiverCompleted && (
                                <span className="badge bg-info me-2">
                                  <i className="bi bi-person-check me-1"></i>
                                  Receiver completed
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Session Summary */}
                          {request.sessionSummary && (
                            <div className="alert alert-info">
                              <strong>Session Summary:</strong>
                              <br />
                              {request.sessionSummary}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="d-flex gap-2 flex-wrap">
                            {request.status === 'accepted' && 
                             ((user._id === request.requesterId?._id && !request.requesterCompleted) ||
                              (user._id === request.receiverId?._id && !request.receiverCompleted)) && (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleShowCompletionModal(request)}
                              >
                                <i className="bi bi-check-circle me-1"></i>
                                Mark Session Completed
                              </button>
                            )}

                            {!request.sessionTime && (
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleShowScheduleModal(request)}
                              >
                                <i className="bi bi-calendar-plus me-1"></i>
                                Suggest Time
                              </button>
                            )}
                          </div>

                          {/* Show feedback option for completed swaps */}
                          {(request.status === 'accepted' || request.status === 'completed') && !feedbackData[request._id] && (
                            <button
                              className="btn btn-outline-warning btn-sm mt-2"
                              onClick={() => handleShowFeedbackForm(request)}
                            >
                              <i className="bi bi-star me-1"></i>
                              Rate Experience
                            </button>
                          )}
                          {(request.status === 'accepted' || request.status === 'completed') && feedbackData[request._id] && (
                            <small className="text-muted mt-2 d-block">
                              <i className="bi bi-check-circle me-1"></i>
                              Feedback submitted
                            </small>
                          )}
                        </div>
                      )}

                      {request.status === 'rejected' && (
                        <div className="text-danger small">
                          <i className="bi bi-x-circle me-1"></i>
                          Request was declined.
                        </div>
                      )}
                    </div>
                  )
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox display-4 mb-3"></i>
                  <p>No incoming requests</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Outgoing Requests */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-send me-2"></i>
                Outgoing Requests
              </h5>
              <span className="badge bg-dark">
                {swapRequests.outgoing?.length || 0}
              </span>
            </div>
            <div className="card-body">
              {requestsLoading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : swapRequests.outgoing && swapRequests.outgoing.length > 0 ? (
                <div className="space-y-3">
                  {swapRequests.outgoing.map((request) => {
                    const otherUser = request.receiverId;
                    return (
                    <div key={request._id} className="border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{request.receiverId?.name}</h6>
                          <small className="text-muted">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <span className={`badge ${
                          request.status === 'pending' ? 'bg-warning' :
                          request.status === 'accepted' ? 'bg-success' : 
                          request.status === 'completed' ? 'bg-info' : 'bg-danger'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="d-flex align-items-center mb-1">
                          <span className="badge bg-primary me-2">You Offer:</span>
                          <span>{request.skillOffered}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-success me-2">You Want:</span>
                          <span>{request.skillWanted}</span>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mb-2">
                          <small className="text-muted">
                            <i className="bi bi-chat-quote me-1"></i>
                            Your message: "{request.message}"
                          </small>
                        </div>
                      )}

                      {request.status === 'pending' && (
                        <div className="text-muted small">
                          <i className="bi bi-clock me-1"></i>
                          Awaiting response...
                        </div>
                      )}

                      {request.status === 'accepted' && (
                        <div>
                          <div className="text-success small mb-2">
                            <i className="bi bi-check-circle me-1"></i>
                            Request accepted! You can now connect.
                          </div>
                          
                          {/* Contact Information */}
                          <div className="card border-success mb-3">
                            <div className="card-header bg-success text-white">
                              <h6 className="mb-0">
                                <i className="bi bi-person-lines-fill me-2"></i>
                                Contact Information
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6">
                                  <strong>Email:</strong>
                                  <br />
                                  <a href={`mailto:${otherUser?.email}`} className="text-decoration-none">
                                    {otherUser?.email}
                                  </a>
                                </div>
                                <div className="col-md-6">
                                  {otherUser?.phone && (
                                    <>
                                      <strong>WhatsApp:</strong>
                                      <br />
                                      <a 
                                        href={`https://wa.me/${otherUser.phone.replace(/\D/g, '')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-decoration-none text-success"
                                      >
                                        <i className="bi bi-whatsapp me-1"></i>
                                        {otherUser.phone}
                                      </a>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {/* Session Time */}
                              {request.sessionTime && (
                                <div className="mt-3 p-2 bg-light rounded">
                                  <strong>Suggested Session Time:</strong>
                                  <br />
                                  <i className="bi bi-calendar-event me-1"></i>
                                  {new Date(request.sessionTime).toLocaleString()}
                                </div>
                              )}
                              
                              {/* Additional Contact Info */}
                              {(request.contactEmail || request.contactPhone) && (
                                <div className="mt-3">
                                  <strong>Additional Contact:</strong>
                                  <br />
                                  {request.contactEmail && (
                                    <div>
                                      <i className="bi bi-envelope me-1"></i>
                                      {request.contactEmail}
                                    </div>
                                  )}
                                  {request.contactPhone && (
                                    <div>
                                      <i className="bi bi-telephone me-1"></i>
                                      {request.contactPhone}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Completion Status */}
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              {request.requesterCompleted && (
                                <span className="badge bg-info me-2">
                                  <i className="bi bi-person-check me-1"></i>
                                  Requester completed
                                </span>
                              )}
                              {request.receiverCompleted && (
                                <span className="badge bg-info me-2">
                                  <i className="bi bi-person-check me-1"></i>
                                  Receiver completed
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Session Summary */}
                          {request.sessionSummary && (
                            <div className="alert alert-info">
                              <strong>Session Summary:</strong>
                              <br />
                              {request.sessionSummary}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="d-flex gap-2 flex-wrap">
                            {request.status === 'accepted' && 
                             ((user._id === request.requesterId?._id && !request.requesterCompleted) ||
                              (user._id === request.receiverId?._id && !request.receiverCompleted)) && (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleShowCompletionModal(request)}
                              >
                                <i className="bi bi-check-circle me-1"></i>
                                Mark Session Completed
                              </button>
                            )}

                            {!request.sessionTime && (
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleShowScheduleModal(request)}
                              >
                                <i className="bi bi-calendar-plus me-1"></i>
                                Suggest Time
                              </button>
                            )}
                          </div>

                          {/* Show feedback option for completed swaps */}
                          {(request.status === 'accepted' || request.status === 'completed') && !feedbackData[request._id] && (
                            <button
                              className="btn btn-outline-warning btn-sm mt-2"
                              onClick={() => handleShowFeedbackForm(request)}
                            >
                              <i className="bi bi-star me-1"></i>
                              Rate Experience
                            </button>
                          )}
                          {(request.status === 'accepted' || request.status === 'completed') && feedbackData[request._id] && (
                            <small className="text-muted mt-2 d-block">
                              <i className="bi bi-check-circle me-1"></i>
                              Feedback submitted
                            </small>
                          )}
                        </div>
                      )}

                      {request.status === 'rejected' && (
                        <div className="text-danger small">
                          <i className="bi bi-x-circle me-1"></i>
                          Request was declined.
                        </div>
                      )}
                    </div>
                  )
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-send display-4 mb-3"></i>
                  <p>No outgoing requests</p>
                  <Link to="/search" className="btn btn-outline-primary btn-sm">
                    Find Skills to Request
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rate Your Experience</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleFeedbackCancel}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <FeedbackForm
                  swap={showFeedbackForm}
                  otherUser={getOtherUser(showFeedbackForm)}
                  onSuccess={handleFeedbackSuccess}
                  onCancel={handleFeedbackCancel}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <ScheduleModal
        show={!!showScheduleModal}
        onHide={() => setShowScheduleModal(null)}
        onSchedule={handleScheduleSubmit}
        swapRequest={showScheduleModal}
      />

      {/* Completion Modal */}
      <CompletionModal
        show={!!showCompletionModal}
        onHide={() => setShowCompletionModal(null)}
        onComplete={handleCompletionSubmit}
        swapRequest={showCompletionModal}
      />
    </div>
  );
};

export default Dashboard;
