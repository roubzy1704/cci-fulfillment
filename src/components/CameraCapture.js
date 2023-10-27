import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../css/CameraCapture.css';

/**
 * CameraCapture Component
 * 
 * This component provides a UI to start a camera, capture an image, and stop the camera.
 * It displays the captured image and alerts the user if there are any errors accessing the camera.
 * 
 * @param {Function} onCapture - Callback function that receives the captured image as a data URL.
 */
const CameraCapture = ({ onCapture }) => {
	const [error, setError] = useState(null);              // State to manage any camera-related errors
	const [stream, setStream] = useState(null);            // State to hold the camera stream
	const [imageSrc, setImageSrc] = useState(null);        // State to keep the captured image data URL
	const videoRef = useRef(null);                         // Reference to the video element for camera preview

	/**
	 * Asynchronously starts the camera and sets the stream to the video element.
	 */
	const startCamera = async () => {
		try {
			const constraints = {
				video: {
					facingMode: 'environment'  // Prefer rear camera on devices
				}
			};
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			setStream(stream);
			setError(null);
		} catch (err) {
			setError("Failed to access the camera. Ensure it's enabled and try again.");
		}
	};

	/**
	 * Stops the active camera stream.
	 */
	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach(track => track.stop());
			setStream(null);
		}
	};

	/**
	 * Captures the current frame from the camera stream, converts it to a data URL, and
	 * invokes the onCapture callback.
	 */
	const captureImage = useCallback(() => {
		try {
			const canvas = document.createElement("canvas");
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
			const imgSrc = canvas.toDataURL("image/png");

			setImageSrc(imgSrc);  // Store captured image data URL
			onCapture(imgSrc);

			// Ensure to stop the camera after capture
			stream.getTracks().forEach(track => track.stop());
			setStream(null);
		} catch (err) {
			setError("Failed to capture the image. Please try again.");
		}
	}, [onCapture, stream]);

	/**
	 * Effect hook to manage the camera stream lifecycle.
	 * Assigns the stream to the video element when available and cleans up the stream on unmount.
	 */
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
				<video ref={videoRef} autoPlay></video>
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
