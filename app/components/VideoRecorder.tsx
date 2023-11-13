import React, { useState, useRef, useEffect } from 'react';
import ActionButton from './ActionButton';
import LiveVideo from './LiveVideo';
import RecordedVideo from './RecordedVideo';

const VideoRecorder = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoRecorder, setVideoRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideoChunks, setRecordedVideoChunks] = useState<Blob[]>([]);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const recordedVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (liveVideoRef.current && videoStream) {
      liveVideoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    if (recordedVideoRef.current && recordedVideoChunks.length > 0) {
      const blob = new Blob(recordedVideoChunks, { type: 'video/webm' });
      recordedVideoRef.current.src = URL.createObjectURL(blob);
    }
  }, [recordedVideoChunks]);

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden' && isRecording) {
      stopRecording();
      alert('Recording stopped due to tab change.');
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoStream(mediaStream);

      const recorder = new MediaRecorder(mediaStream);
      recorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          setRecordedVideoChunks([event.data]);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
        mediaStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      };

      recorder.start();
      setVideoRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera and microphone:', error);
    }
  };

  const stopRecording = () => {
    if (videoRecorder && videoRecorder.state === 'recording') {
      videoRecorder.stop();
    }
  };

  const downloadRecording = () => {
    if (recordedVideoChunks.length > 0) {
      const blob = new Blob(recordedVideoChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'recording.webm';
      downloadLink.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="video-recorder-container">
      <h1>Video Recorder</h1>
      <div className="buttons-container">
        <ActionButton onClick={startRecording} disabled={isRecording} label="Start Recording" />
        <ActionButton onClick={stopRecording} disabled={!isRecording} label="Stop Recording" />
        <ActionButton onClick={downloadRecording} disabled={!videoRecorder || videoRecorder.state !== 'inactive'} label="Download Recording" />
      </div>
      <LiveVideo videoRef={liveVideoRef} stream={videoStream} recording={isRecording} />
      {!isRecording && <RecordedVideo recordedChunks={recordedVideoChunks} />}
    </div>
  );
};

export default VideoRecorder;
