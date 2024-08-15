import React, { useState, useEffect, useRef, useCallback } from 'react';

const SessionManager = ({ sessionId, onSessionExpired, onWarning, websocket, sessionStatus, isActiveChat }) => {
  console.log('SessionManager rendered with sessionId:', sessionId); // Debug
  
  const onSessionExpiredRef = useRef(onSessionExpired);
  const onWarningRef = useRef(onWarning);

  useEffect(() => {
    onSessionExpiredRef.current = onSessionExpired;
    onWarningRef.current = onWarning;
  }, [onSessionExpired, onWarning]);

  useEffect(() => {
    if (sessionStatus === 'warning') {
      onWarningRef.current();
    } else if (sessionStatus === 'expired') {
      onSessionExpiredRef.current();
    }
  }, [sessionStatus]);

  // Request status update every 10 seconds
  useEffect(() => {
    let statusCheck;
    if (isActiveChat && websocket) {
      console.log('SessionManager useEffect triggered', { isActiveChat, websocket });
      statusCheck = setInterval(() => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          console.log('Sending status check request'); // Debug
          websocket.send(JSON.stringify({ type: 'get_session_status', sessionId }));
        }
      }, 10000);
    }

    return () => {
      if (statusCheck) {
        clearInterval(statusCheck);
      }
    }

  }, [websocket, sessionId, isActiveChat]);

  return null;
};

export default SessionManager;