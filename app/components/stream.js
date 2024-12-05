// pages/stream.js (Next.js page for streaming)

import { useEffect, useRef } from 'react';

const Stream = ({url}) => {
  const videoRef = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    const startStreaming = async () => {
      try {
        // Step 1: Capture media stream from the user's webcam
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Display the webcam video to the user
        videoRef.current.srcObject = stream;

        // Step 2: Setup WebRTC connection to send the stream to the WHIP server (Janus)
        const connection = new RTCPeerConnection();
        stream.getTracks().forEach(track => connection.addTrack(track, stream));

        // Setup ICE servers for WebRTC (optional, for NAT traversal)
        connection.setConfiguration({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        // Step 3: Send the WebRTC stream to the Janus WHIP endpoint
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);

        // Assuming the Janus WHIP endpoint accepts POST requests with WebRTC offer
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sdp: offer.sdp,
            type: offer.type,
          }),
        });

        const answer = await response.json();
        await connection.setRemoteDescription(answer);

        connectionRef.current = connection;
      } catch (err) {
        console.error('Error streaming media:', err);
      }
    };

    startStreaming();

    // Cleanup the connection on unmount
    return () => {
      if (connectionRef.current) {
        connectionRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>Live Stream</h1>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default Stream;
