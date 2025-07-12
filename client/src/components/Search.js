import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

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

  return (
    <div className="container">
      {/* Search Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white p-4 rounded">
            <h2 className="mb-1">Find Skills & Connect</h2>
            <p className="mb-0">Search for people who can teach you new skills or want to learn from you</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-search me-2"></i>
                Search Users
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="searchTerm" className="form-label">
                      Skill Keyword <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="searchTerm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="e.g., JavaScript, Photography, Cooking"
                      required
                    />
                  </div>
                  
                  <div className="col-md-3 mb-3">
                    <label htmlFor="location" className="form-label">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                    />
                  </div>
                  
                  <div className="col-md-3 mb-3">
                    <label htmlFor="availability" className="form-label">
                      Availability (Optional)
                    </label>
                    <select
                      className="form-select"
                      id="availability"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-1"></i>
                        Search
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={clearSearch}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Clear
                  </button>
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
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="bi bi-person me-1"></i>
                            View Profile
                          </button>
                          <button className="btn btn-primary btn-sm">
                            <i className="bi bi-chat-dots me-1"></i>
                            Connect
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
    </div>
  );
};

export default Search;
