import React, { useState, useEffect, useRef, useCallback } from 'react';

const SessionManager = ({ sessionId, onSessionExpired, onWarning, websocket }) => {
  console.log('SessionManager rendered with sessionId:', sessionId); // Debug
  const [serverExpiryTime, setServerExpiryTime] = useState(null);
  const [displayTimeRemaining, setDisplayTimeRemaining] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('active');
  
  const onSessionExpiredRef = useRef(onSessionExpired);
  const onWarningRef = useRef(onWarning);

  useEffect(() => {
    console.log('Updating onSessionExpired and onWarning refs'); // Debug
    onSessionExpiredRef.current = onSessionExpired;
    onWarningRef.current = onWarning;
  }, [onSessionExpired, onWarning]);

  const updateSessionStatus = useCallback((status) => {
    console.log('Updating session status:', status); // Debug
    setServerExpiryTime(new Date(status.expiryTime));
    setSessionStatus(status.status);
    if (status.status === 'warning') {
      console.log('Warning: Session about to expire, time remaining:', status.timeRemaining); // Debug
      setDisplayTimeRemaining(status.timeRemaining);
      onWarningRef.current(status.timeRemaining);
    } else if (status.status === 'expired') {
      console.log('Session expired'); // Debug
      onSessionExpiredRef.current();
    } else {
      setDisplayTimeRemaining(null);
    }
  }, []);

  useEffect(() => {
    if (websocket) {
      console.log('Setting up websocket message handler'); // Debug
      websocket.onmessage = (event) => {
        console.log('Received websocket message:', event.data); // Debug
        const message = JSON.parse(event.data);
        if (message.type === 'session_status') {
          updateSessionStatus(JSON.parse(message.content));
        }
      };
    }
  }, [websocket, updateSessionStatus]);

  // Request status update every 30 seconds
  useEffect(() => {
    console.log('Setting up periodic status check'); // Debug
    const statusCheck = setInterval(() => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        console.log('Sending status check request'); // Debug
        websocket.send(JSON.stringify({ type: 'get_session_status', sessionId }));
      }
    }, 30000);

    return () => {
      console.log('Clearing periodic status check'); // Debug
      clearInterval(statusCheck);
    }
  }, [websocket, sessionId]);

  console.log('Rendering SessionManager, status:', sessionStatus, 'timeRemaining:', displayTimeRemaining); // Debug
  return (
    <div className="text-sm text-gray-500">
      {sessionStatus === 'warning' && displayTimeRemaining !== null && (
        <p>
          Warning: Session expiring in {Math.floor(displayTimeRemaining / 60)}:{(displayTimeRemaining % 60).toString().padStart(2, '0')}
        </p>
      )}
    </div>
  );
};

export default SessionManager;