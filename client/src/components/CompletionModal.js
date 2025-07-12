import React, { useState } from 'react';

const CompletionModal = ({ show, onHide, onComplete, swapRequest }) => {
  const [sessionSummary, setSessionSummary] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(sessionSummary);
    onHide();
    setSessionSummary('');
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-check-circle me-2"></i>
              Mark Session as Completed
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="alert alert-success">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Great!</strong> You're about to mark this session as completed. 
                Both participants need to confirm completion before the swap is considered finished.
              </div>

              <div className="mb-3">
                <label htmlFor="sessionSummary" className="form-label">
                  <i className="bi bi-journal-text me-1"></i>
                  Session Summary (Optional)
                </label>
                <textarea
                  className="form-control"
                  id="sessionSummary"
                  rows={4}
                  value={sessionSummary}
                  onChange={(e) => setSessionSummary(e.target.value)}
                  placeholder="How did the session go? What did you learn or teach?"
                  maxLength={1000}
                />
                <div className="form-text">
                  Share a brief summary of your experience ({sessionSummary.length}/1000 characters)
                </div>
              </div>

              <div className="border rounded p-3 bg-light">
                <h6 className="mb-2">
                  <i className="bi bi-arrow-left-right me-1"></i>
                  Swap Details:
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <strong>Skills Exchanged:</strong>
                    <br />
                    <span className="badge bg-primary me-1">{swapRequest?.skillOffered}</span>
                    ↔
                    <span className="badge bg-success ms-1">{swapRequest?.skillWanted}</span>
                  </div>
                  <div className="col-md-6">
                    {swapRequest?.sessionTime && (
                      <>
                        <strong>Session Time:</strong>
                        <br />
                        <small>{new Date(swapRequest.sessionTime).toLocaleString()}</small>
                      </>
                    )}
                  </div>
                </div>
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
                className="btn btn-success"
              >
                <i className="bi bi-check-circle me-1"></i>
                Mark as Completed
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
