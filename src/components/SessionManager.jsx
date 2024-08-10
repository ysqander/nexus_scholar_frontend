import React, { useState, useEffect, useRef, useCallback } from 'react';

const SessionManager = ({ sessionId, onSessionExpired, onWarning, websocket }) => {
  const [serverExpiryTime, setServerExpiryTime] = useState(null);
  const [displayTimeRemaining, setDisplayTimeRemaining] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('active');
  
  const onSessionExpiredRef = useRef(onSessionExpired);
  const onWarningRef = useRef(onWarning);

  useEffect(() => {
    onSessionExpiredRef.current = onSessionExpired;
    onWarningRef.current = onWarning;
  }, [onSessionExpired, onWarning]);

  const updateSessionStatus = useCallback((status) => {
    setServerExpiryTime(new Date(status.expiryTime));
    setSessionStatus(status.status);

    if (status.status === 'warning') {
      onWarningRef.current(status.timeRemaining);
    } else if (status.status === 'expired') {
      onSessionExpiredRef.current();
    }
  }, []);

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'session_status') {
          updateSessionStatus(message.content);
        }
      };
    }
  }, [websocket, updateSessionStatus]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (serverExpiryTime) {
        const remaining = Math.max(0, Math.floor((serverExpiryTime - new Date()) / 1000));
        setDisplayTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [serverExpiryTime]);

  // Request status update every 30 seconds
  useEffect(() => {
    const statusCheck = setInterval(() => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ type: 'get_session_status', sessionId }));
      }
    }, 30000);

    return () => clearInterval(statusCheck);
  }, [websocket, sessionId]);

  // Initial status request
  useEffect(() => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ type: 'get_session_status', sessionId }));
    }
  }, [websocket, sessionId]);

  return (
    <div className="text-sm text-gray-500">
      {displayTimeRemaining !== null && (
        <p>
          Session status: {sessionStatus}
          {sessionStatus !== 'expired' && (
            <span> - Expires in: {Math.floor(displayTimeRemaining / 60)}:{(displayTimeRemaining % 60).toString().padStart(2, '0')}</span>
          )}
        </p>
      )}
    </div>
  );
};

export default SessionManager;