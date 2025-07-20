import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      const userData = JSON.parse(user);
      
      // Initialize socket connection
      const newSocket = io(window.location.origin, {
        auth: {
          token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server:', newSocket.id);
        setConnected(true);
        
        // Join user's personal room for notifications
        newSocket.emit('join', userData._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
      });

      // Listen for swap request events
      newSocket.on('swap_request', (data) => {
        console.log('Received swap request event:', data);
        handleSwapRequestNotification(data);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }
  }, []);

  const handleSwapRequestNotification = (data) => {
    const { type, data: requestData } = data;

    switch (type) {
      case 'new_request':
        toast.info(
          <div>
            <strong>New Swap Request!</strong>
            <br />
            <span className="text-muted">From: {requestData.from}</span>
            <br />
            <small>Wants to exchange {requestData.skillWanted} for {requestData.skillOffered}</small>
          </div>,
          {
            position: "top-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        break;

      case 'request_accepted':
        toast.success(
          <div>
            <strong>Request Accepted! 🎉</strong>
            <br />
            <span className="text-muted">{requestData.acceptedBy} accepted your swap request</span>
            <br />
            <small>{requestData.skillOffered} ↔ {requestData.skillWanted}</small>
          </div>,
          {
            position: "top-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        break;

      case 'request_rejected':
        toast.error(
          <div>
            <strong>Request Rejected</strong>
            <br />
            <span className="text-muted">{requestData.rejectedBy} declined your swap request</span>
            <br />
            <small>Reason: {requestData.reason}</small>
          </div>,
          {
            position: "top-right",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        break;

      default:
        console.log('Unknown notification type:', type);
    }
  };

  const value = {
    socket,
    connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
