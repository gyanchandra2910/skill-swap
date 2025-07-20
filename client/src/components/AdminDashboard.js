import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [userActivity, setUserActivity] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        window.location.href = '/dashboard';
        return;
      }
    } else {
      toast.error('Please login to access admin dashboard.');
      window.location.href = '/login';
      return;
    }

    fetchStats();
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      });

      const response = await axios.get(`/api/admin/users?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setUsersLoading(false);
      setLoading(false);
    }
  };

  const fetchUserActivity = async (userId) => {
    setActivityLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/admin/users/${userId}/activity`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setUserActivity(response.data.activity);
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
      toast.error('Failed to fetch user activity');
    } finally {
      setActivityLoading(false);
    }
  };

  const handleViewActivity = (user) => {
    setSelectedUser(user);
    setShowActivityModal(true);
    fetchUserActivity(user._id);
  };

  const handleBanUser = async (user, ban = true) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/admin/users/${user._id}/ban`,
        { 
          ban, 
          reason: ban ? banReason : undefined 
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        setShowBanModal(false);
        setBanReason('');
        setSelectedUser(null);
        fetchUsers(); // Refresh users list
      }
    } catch (error) {
      console.error('Error updating user ban status:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const downloadReport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/admin/report?type=${type}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${type} report downloaded successfully`);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="bi bi-gear me-2"></i>
              Admin Dashboard
            </h2>
            <div className="d-flex gap-2">
              <div className="dropdown">
                <button 
                  className="btn btn-outline-primary dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-download me-1"></i>
                  Download Reports
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => downloadReport('users')}
                    >
                      <i className="bi bi-people me-2"></i>
                      Users Report
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => downloadReport('swaps')}
                    >
                      <i className="bi bi-arrow-left-right me-2"></i>
                      Swaps Report
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => downloadReport('feedback')}
                    >
                      <i className="bi bi-chat-square-text me-2"></i>
                      Feedback Report
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">Total Users</h5>
                      <h2>{stats.users?.total || 0}</h2>
                      <small>+{stats.users?.newLast30Days || 0} this month</small>
                    </div>
                    <i className="bi bi-people display-4 opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">Active Users</h5>
                      <h2>{stats.users?.active || 0}</h2>
                      <small>{stats.users?.banned || 0} banned</small>
                    </div>
                    <i className="bi bi-person-check display-4 opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">Total Swaps</h5>
                      <h2>{stats.swaps?.total || 0}</h2>
                      <small>{stats.swaps?.pending || 0} pending</small>
                    </div>
                    <i className="bi bi-arrow-left-right display-4 opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">Avg Rating</h5>
                      <h2>{stats.feedback?.averageRating?.toFixed(1) || '0.0'}</h2>
                      <small>{stats.feedback?.total || 0} reviews</small>
                    </div>
                    <i className="bi bi-star display-4 opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Management */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">User Management</h5>
            </div>
            <div className="card-body">
              {/* Search and Filters */}
              <form onSubmit={handleSearch} className="row g-3 mb-4">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-primary w-100">
                    <i className="bi bi-search me-1"></i>
                    Search
                  </button>
                </div>
                <div className="col-md-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary w-100"
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                </div>
              </form>

              {/* Users Table */}
              {usersLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Stats</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className={user.isBanned ? 'table-danger' : ''}>
                          <td>
                            <div className="d-flex align-items-center">
                              {user.profilePhoto ? (
                                <img
                                  src={user.profilePhoto}
                                  alt={user.name}
                                  className="rounded-circle me-2"
                                  style={{ width: '32px', height: '32px' }}
                                />
                              ) : (
                                <div 
                                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-2"
                                  style={{ width: '32px', height: '32px', fontSize: '14px' }}
                                >
                                  {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="fw-bold">{user.name}</div>
                                <small className="text-muted">{user.location || 'No location'}</small>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            {user.isBanned ? (
                              <span className="badge bg-danger">Banned</span>
                            ) : (
                              <span className={`badge ${
                                user.availability === 'available' ? 'bg-success' :
                                user.availability === 'busy' ? 'bg-warning' : 'bg-secondary'
                              }`}>
                                {user.availability}
                              </span>
                            )}
                          </td>
                          <td>
                            <small>
                              <div>Swaps: {(user.stats?.swapsSent || 0) + (user.stats?.swapsReceived || 0)}</div>
                              <div>Rating: {user.stats?.averageRating?.toFixed(1) || 'N/A'} ({user.stats?.totalReviews || 0})</div>
                            </small>
                          </td>
                          <td>
                            <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              {user.isBanned ? (
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => handleBanUser(user, false)}
                                  title="Unban User"
                                >
                                  <i className="bi bi-person-check"></i>
                                </button>
                              ) : (
                                user.role !== 'admin' && (
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowBanModal(true);
                                    }}
                                    title="Ban User"
                                  >
                                    <i className="bi bi-person-x"></i>
                                  </button>
                                )
                              )}
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleViewActivity(user)}
                                title="View Activity"
                              >
                                <i className="bi bi-activity"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                      ) {
                        return (
                          <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      } else if (
                        pageNum === currentPage - 3 ||
                        pageNum === currentPage + 3
                      ) {
                        return (
                          <li key={pageNum} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Modal */}
      {showActivityModal && selectedUser && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-activity me-2"></i>
                  Activity for {selectedUser.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowActivityModal(false);
                    setSelectedUser(null);
                    setUserActivity(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {activityLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading user activity...</p>
                  </div>
                ) : userActivity ? (
                  <div>
                    {/* User Info */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-header">
                            <h6 className="mb-0">User Information</h6>
                          </div>
                          <div className="card-body">
                            <p><strong>Name:</strong> {selectedUser.name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Role:</strong> 
                              <span className={`badge ms-2 ${selectedUser.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                {selectedUser.role}
                              </span>
                            </p>
                            <p><strong>Status:</strong> 
                              <span className={`badge ms-2 ${selectedUser.isBanned ? 'bg-danger' : 'bg-success'}`}>
                                {selectedUser.isBanned ? 'Banned' : 'Active'}
                              </span>
                            </p>
                            <p><strong>Member Since:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-header">
                            <h6 className="mb-0">Quick Stats</h6>
                          </div>
                          <div className="card-body">
                            <p><strong>Skills Offered:</strong> {selectedUser.skillsOffered?.length || 0}</p>
                            <p><strong>Skills Wanted:</strong> {selectedUser.skillsWanted?.length || 0}</p>
                            <p><strong>Average Rating:</strong> {selectedUser.stats?.averageRating?.toFixed(1) || 'N/A'}</p>
                            <p><strong>Total Reviews:</strong> {selectedUser.stats?.totalReviews || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Swap Requests */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="card">
                          <div className="card-header">
                            <h6 className="mb-0">
                              <i className="bi bi-arrow-left-right me-2"></i>
                              Swap Requests ({userActivity.swapRequests?.length || 0})
                            </h6>
                          </div>
                          <div className="card-body">
                            {userActivity.swapRequests && userActivity.swapRequests.length > 0 ? (
                              <div className="table-responsive">
                                <table className="table table-sm">
                                  <thead>
                                    <tr>
                                      <th>Date</th>
                                      <th>Type</th>
                                      <th>Other User</th>
                                      <th>Skills</th>
                                      <th>Status</th>
                                      <th>Message</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {userActivity.swapRequests.map((swap) => (
                                      <tr key={swap._id}>
                                        <td>{new Date(swap.createdAt).toLocaleDateString()}</td>
                                        <td>
                                          <span className={`badge ${
                                            swap.requesterId._id === selectedUser._id ? 'bg-info' : 'bg-warning'
                                          }`}>
                                            {swap.requesterId._id === selectedUser._id ? 'Sent' : 'Received'}
                                          </span>
                                        </td>
                                        <td>
                                          {swap.requesterId._id === selectedUser._id ? 
                                            swap.receiverId?.name : swap.requesterId?.name}
                                        </td>
                                        <td>
                                          <small>
                                            <div><strong>Offered:</strong> {swap.skillOffered}</div>
                                            <div><strong>Wanted:</strong> {swap.skillWanted}</div>
                                          </small>
                                        </td>
                                        <td>
                                          <span className={`badge ${
                                            swap.status === 'accepted' ? 'bg-success' :
                                            swap.status === 'rejected' ? 'bg-danger' : 'bg-secondary'
                                          }`}>
                                            {swap.status}
                                          </span>
                                        </td>
                                        <td>
                                          <small>{swap.message || 'No message'}</small>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-muted mb-0">No swap requests found.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="row">
                      <div className="col-12">
                        <div className="card">
                          <div className="card-header">
                            <h6 className="mb-0">
                              <i className="bi bi-chat-square-text me-2"></i>
                              Feedback ({userActivity.feedback?.length || 0})
                            </h6>
                          </div>
                          <div className="card-body">
                            {userActivity.feedback && userActivity.feedback.length > 0 ? (
                              <div className="table-responsive">
                                <table className="table table-sm">
                                  <thead>
                                    <tr>
                                      <th>Date</th>
                                      <th>Type</th>
                                      <th>Other User</th>
                                      <th>Rating</th>
                                      <th>Comment</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {userActivity.feedback.map((fb) => (
                                      <tr key={fb._id}>
                                        <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                                        <td>
                                          <span className={`badge ${
                                            fb.fromUserId._id === selectedUser._id ? 'bg-info' : 'bg-warning'
                                          }`}>
                                            {fb.fromUserId._id === selectedUser._id ? 'Given' : 'Received'}
                                          </span>
                                        </td>
                                        <td>
                                          {fb.fromUserId._id === selectedUser._id ? 
                                            fb.toUserId?.name : fb.fromUserId?.name}
                                        </td>
                                        <td>
                                          <div className="text-warning">
                                            {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                                          </div>
                                        </td>
                                        <td>
                                          <small>{fb.comment}</small>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-muted mb-0">No feedback found.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-exclamation-circle display-4 text-muted"></i>
                    <p className="mt-2 text-muted">Failed to load user activity.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowActivityModal(false);
                    setSelectedUser(null);
                    setUserActivity(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {showBanModal && selectedUser && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ban User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowBanModal(false);
                    setSelectedUser(null);
                    setBanReason('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  You are about to ban <strong>{selectedUser.name}</strong> ({selectedUser.email}).
                  This action will prevent them from accessing the platform.
                </div>
                
                <div className="mb-3">
                  <label htmlFor="banReason" className="form-label">
                    Reason for ban <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="banReason"
                    className="form-control"
                    rows={3}
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Enter the reason for banning this user..."
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowBanModal(false);
                    setSelectedUser(null);
                    setBanReason('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleBanUser(selectedUser, true)}
                  disabled={!banReason.trim()}
                >
                  <i className="bi bi-person-x me-1"></i>
                  Ban User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default AdminDashboard;
