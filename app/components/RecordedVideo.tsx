// components/RecordedVideo.tsx
import React from 'react';

interface RecordedVideoProps {
  recordedChunks: Blob[];
//   recording : Boolean;
}

const RecordedVideo: React.FC<RecordedVideoProps> = ({ recordedChunks}) => (
  <div>
    {recordedChunks.length > 0 && (
      <>
        <h2>Recorded Video</h2>
        <video src={URL.createObjectURL(new Blob(recordedChunks, { type: 'video/webm' }))} controls />
      </>
    )}
  </div>
);

export default RecordedVideo;
