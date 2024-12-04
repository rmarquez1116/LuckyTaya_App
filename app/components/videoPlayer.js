// components/VideoPlayer.js
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ url }) => {
  const videoNode = useRef(null);

  useEffect(() => {
    if (videoNode.current) {
      const player = videojs(videoNode.current, {
        sources: [{
          src: url,
          type: 'application/x-mpegURL', // Specify HLS MIME type
        }],
      });

      return () => {
        player.dispose();
      };
    }
  }, [url]);

  return (
    <div className="video-container">
      <video ref={videoNode} className="video-js vjs-default-skin" controls />
    </div>
  );
};

export default VideoPlayer;