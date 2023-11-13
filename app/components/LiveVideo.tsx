// components/LiveVideo.tsx
import React from 'react';

interface LiveVideoProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  recording: boolean;
}

const LiveVideo: React.FC<LiveVideoProps> = ({ videoRef, stream, recording }) => (
  <div>
    {recording ? (
      <h2>Live Video</h2>
    ) : null}
    {stream && <video ref={videoRef} autoPlay muted={true} />}
  </div>
);

export default LiveVideo;
