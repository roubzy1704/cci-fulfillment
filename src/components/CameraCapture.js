import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../css/CameraCapture.css';

const CameraCapture = ({ onCapture }) => {
	const [error, setError] = useState(null);
	const [stream, setStream] = useState(null);
	const [imageSrc, setImageSrc] = useState(null); // New state to keep captured image
	const videoRef = useRef(null);

	const startCamera = async () => {
		try {
			const constraints = {
				video: {
					facingMode: 'environment'
				}
			};
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			setStream(stream);
			setError(null);
		} catch (err) {
			setError("Failed to access the camera. Ensure it's enabled and try again.");
		}
	};

	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach(track => track.stop());
			setStream(null);
		}
	};


	const captureImage = useCallback(() => {
		try {
			const canvas = document.createElement("canvas");
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
			const imgSrc = canvas.toDataURL("image/png");

			setImageSrc(imgSrc);  // Store captured image source
			onCapture(imgSrc);

			// Ensure to stop the camera after capture
			stream.getTracks().forEach(track => track.stop());
			setStream(null);
		} catch (err) {
			setError("Failed to capture the image. Please try again.");
		}
	}, [onCapture, stream]);

	useEffect(() => {
		videoRef.current.srcObject = stream;

		return () => {
			// Stop the camera stream when the component unmounts
			stream?.getTracks().forEach(track => track.stop());
		};
	}, [stream]);

	return (
		<div className="camera-container">
			{error && <p className="error-message">{error}</p>}
			<div className="video-and-capture">
				<video ref={videoRef} autoPlay width="640" height="480"></video>
				{imageSrc && <img src={imageSrc} alt="Captured content" className="captured-image" />}
			</div>
			<div className="button-container">
				<button onClick={startCamera} disabled={stream}>Start Camera</button>
				<button onClick={captureImage} disabled={!stream}>Capture</button>
				<button onClick={stopCamera} disabled={!stream}>Stop Camera</button>
			</div>
			{!stream && <p className="instruction-text">Please start the camera to enable the capture button.</p>}
		</div>
	);
};

export default CameraCapture;
