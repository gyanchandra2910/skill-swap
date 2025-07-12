import React, { useState } from 'react';
import axios from 'axios';
import SwapRequestModal from './SwapRequestModal';
import UserProfile from './UserProfile';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notification, setNotification] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a skill to search for');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        skill: searchTerm.trim()
      });

      if (location.trim()) {
        params.append('location', location.trim());
      }

      if (availability) {
        params.append('availability', availability);
      }

      const response = await axios.get(
        `http://localhost:5000/api/users/search?${params.toString()}`
      );

      if (response.data.success) {
        setResults(response.data.users);
      } else {
        setError(response.data.message || 'Search failed');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setLocation('');
    setAvailability('');
    setResults([]);
    setError('');
    setHasSearched(false);
  };

  const getAvailabilityBadgeClass = (availability) => {
    switch (availability) {
      case 'available': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'unavailable': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const handleRequestSwap = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
  };

  const handleSwapSuccess = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-4 mb-4 rounded-3">
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-5 fw-bold mb-3">
                <i className="bi bi-search me-2"></i>
                Discover Skills & Teachers
              </h1>
              <p className="lead mb-0">
                Find passionate teachers and learn new skills from our vibrant community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="row mb-4">
        <div className="col-12">
          {/* Success Notification */}
          {notification && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {notification}
              <button
                type="button"
                className="btn-close"
                onClick={() => setNotification('')}
                aria-label="Close"
              ></button>
            </div>
          )}
          
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-white border-0 pt-4">
              <h4 className="text-center mb-0">
                <i className="bi bi-funnel me-2 text-primary"></i>
                Search Filters
              </h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSearch}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label htmlFor="searchTerm" className="form-label fw-semibold">
                      <i className="bi bi-lightbulb me-1 text-warning"></i>
                      Skill Keyword <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="searchTerm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="e.g., JavaScript, Photography, Cooking"
                      required
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label htmlFor="location" className="form-label fw-semibold">
                      <i className="bi bi-geo-alt me-1 text-danger"></i>
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., New York, Remote..."
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <label htmlFor="availability" className="form-label fw-semibold">
                      <i className="bi bi-clock me-1 text-info"></i>
                      Availability
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="availability"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    >
                      <option value="">Any availability</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-12 text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5 py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Search Teachers
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg ms-3 px-4 py-3"
                      onClick={clearSearch}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>
                Search Results 
                {results.length > 0 && (
                  <span className="badge bg-primary ms-2">{results.length}</span>
                )}
              </h4>
              {searchTerm && (
                <small className="text-muted">
                  Searching for: "<strong>{searchTerm}</strong>"
                  {location && ` in ${location}`}
                </small>
              )}
            </div>

            {results.length === 0 && !loading ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-search display-1 text-muted"></i>
                </div>
                <h5 className="text-muted">No users found</h5>
                <p className="text-muted">
                  Try searching with different keywords or remove location/availability filters
                </p>
              </div>
            ) : (
              <div className="row">
                {results.map((user) => (
                  <div key={user._id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        {/* User Header */}
                        <div className="d-flex align-items-center mb-3">
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
                          <div className="flex-grow-1">
                            <h6 className="card-title mb-1">{user.name}</h6>
                            <p className="text-muted small mb-1">
                              {user.location || 'Location not specified'}
                            </p>
                            <span className={`badge ${getAvailabilityBadgeClass(user.availability)}`}>
                              {user.availability}
                            </span>
                          </div>
                        </div>

                        {/* Skills Offered */}
                        {user.skillsOffered && user.skillsOffered.length > 0 && (
                          <div className="mb-3">
                            <h6 className="small text-primary mb-2">
                              <i className="bi bi-mortarboard me-1"></i>
                              Can Teach:
                            </h6>
                            <div>
                              {user.skillsOffered.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="badge bg-primary me-1 mb-1"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {skill}
                                </span>
                              ))}
                              {user.skillsOffered.length > 3 && (
                                <span className="badge bg-secondary" style={{ fontSize: '0.75rem' }}>
                                  +{user.skillsOffered.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Skills Wanted */}
                        {user.skillsWanted && user.skillsWanted.length > 0 && (
                          <div className="mb-3">
                            <h6 className="small text-success mb-2">
                              <i className="bi bi-lightbulb me-1"></i>
                              Wants to Learn:
                            </h6>
                            <div>
                              {user.skillsWanted.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="badge bg-success me-1 mb-1"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {skill}
                                </span>
                              ))}
                              {user.skillsWanted.length > 3 && (
                                <span className="badge bg-secondary" style={{ fontSize: '0.75rem' }}>
                                  +{user.skillsWanted.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="d-grid gap-2">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleViewProfile(user)}
                          >
                            <i className="bi bi-person me-1"></i>
                            View Profile
                          </button>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleRequestSwap(user)}
                          >
                            <i className="bi bi-arrow-left-right me-1"></i>
                            Request Swap
                          </button>
                        </div>
                      </div>
                      
                      {/* Card Footer */}
                      <div className="card-footer bg-light small text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Swap Request Modal */}
      {showModal && selectedUser && (
        <SwapRequestModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSuccess={handleSwapSuccess}
        />
      )}

      {/* User Profile Modal */}
      {showProfileModal && selectedUser && (
        <UserProfile
          user={selectedUser}
          onClose={handleCloseProfileModal}
          onRequestSwap={handleRequestSwap}
        />
      )}
    </div>
  );
};

export default Search;
