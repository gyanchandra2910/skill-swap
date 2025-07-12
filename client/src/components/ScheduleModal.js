import React, { useState } from 'react';

const ScheduleModal = ({ show, onHide, onSchedule, swapRequest }) => {
  const [sessionTime, setSessionTime] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduleData = {};
    
    if (sessionTime) scheduleData.sessionTime = sessionTime;
    if (contactEmail) scheduleData.contactEmail = contactEmail;
    if (contactPhone) scheduleData.contactPhone = contactPhone;
    
    onSchedule(scheduleData);
    onHide();
    
    // Reset form
    setSessionTime('');
    setContactEmail('');
    setContactPhone('');
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-calendar-plus me-2"></i>
              Schedule Session
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="sessionTime" className="form-label">
                  <i className="bi bi-calendar-event me-1"></i>
                  Preferred Session Time
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="sessionTime"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <div className="form-text">
                  Suggest a time that works for both of you
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="contactEmail" className="form-label">
                  <i className="bi bi-envelope me-1"></i>
                  Additional Contact Email (Optional)
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="contactEmail"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="alternative@email.com"
                />
                <div className="form-text">
                  If you prefer to use a different email for this session
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="contactPhone" className="form-label">
                  <i className="bi bi-telephone me-1"></i>
                  Phone/WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1234567890"
                />
                <div className="form-text">
                  For voice calls or WhatsApp messaging
                </div>
              </div>

              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Note:</strong> These details will be shared with the other person to help coordinate your session.
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <i className="bi bi-calendar-check me-1"></i>
                Update Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
