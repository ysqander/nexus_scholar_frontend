import React, { useState, useEffect, useRef, useCallback } from 'react';

const SessionManager = ({ sessionId, onSessionExpired, onWarning, websocket, sessionStatus, isActiveChat }) => {
  console.log('SessionManager rendered with sessionId:', sessionId); // Debug
  
  const onSessionExpiredRef = useRef(onSessionExpired);
  const onWarningRef = useRef(onWarning);

  useEffect(() => {
    console.log('Updating onSessionExpired and onWarning refs'); // Debug
    onSessionExpiredRef.current = onSessionExpired;
    onWarningRef.current = onWarning;
  }, [onSessionExpired, onWarning]);

  useEffect(() => {
    if (sessionStatus === 'warning') {
      console.log('Warning: Session about to expire'); // Debug
      onWarningRef.current();
    } else if (sessionStatus === 'expired') {
      console.log('Session expired'); // Debug
      onSessionExpiredRef.current();
    }
  }, [sessionStatus]);

  // Request status update every 10 seconds
  useEffect(() => {
    console.log('Setting up periodic status check'); // Debug
    let statusCheck;
    if (isActiveChat && websocket) {
      statusCheck = setInterval(() => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          console.log('Sending status check request'); // Debug
        websocket.send(JSON.stringify({ type: 'get_session_status', sessionId }));
      }
      }, 10000);
    }

    return () => {
      if (statusCheck) {
        console.log('Clearing periodic status check'); // Debug
        clearInterval(statusCheck);
      }
    }

  }, [websocket, sessionId, isActiveChat]);

  console.log('Rendering SessionManager, status:', sessionStatus); // Debug
  return null;
};

export default SessionManager;