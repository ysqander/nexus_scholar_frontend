import React, { useState, useEffect, useRef, useCallback } from 'react';

const SessionManager = ({ sessionId, onSessionExpired, onWarning, websocket, sessionStatus, isActiveChat }) => {
  console.log('SessionManager rendered with sessionId:', sessionId); // Debug
  
  const onSessionExpiredRef = useRef(onSessionExpired);
  const onWarningRef = useRef(onWarning);
  const websocketRef = useRef(websocket);

  useEffect(() => {
    onSessionExpiredRef.current = onSessionExpired;
    onWarningRef.current = onWarning;
    websocketRef.current = websocket;
  }, [onSessionExpired, onWarning, websocket]);

  useEffect(() => {
    if (sessionStatus === 'warning') {
      onWarningRef.current();
    } else if (sessionStatus === 'expired') {
      onSessionExpiredRef.current();
    }
  }, [sessionStatus]);

  // Request status update every 10 seconds
  useEffect(() => {
    const checkStatus = () => {
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        console.log('Sending status check request'); // Debug
        websocketRef.current.send(JSON.stringify({ type: 'get_session_status', sessionId }));
      }
    };

    const statusCheck = setInterval(checkStatus, 10000);
    checkStatus(); // Perform an immediate check when the component mounts


    return () => {
      clearInterval(statusCheck);
    }

  }, [ sessionId ]);

  return null;
};

export default SessionManager;