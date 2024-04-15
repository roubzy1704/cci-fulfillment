import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import '../css/Signature.css';

/**
 * Signature Component
 * 
 * This component provides a canvas for users to sign. It allows clearing the signature and 
 * accepting it, sending the accepted signature to the parent component.
 * 
 * @param {Object} props - The component's props.
 * @param {Function} props.onAccept - Callback function that receives the accepted signature as a data URL.
 * @param {Object} ref - The forwarded ref to expose certain methods to the parent.
 */
const Signature = forwardRef((props, ref) => {
	const sigCanvas = useRef({});                             // Reference to the signature canvas
	const [isSigned, setIsSigned] = useState(false);          // State to track if the canvas has a signature
	const [acceptedSignature, setAcceptedSignature] = useState(null); // State to hold the accepted signature data URL

	/**
	 * Sets the canvas dimensions based on the parent's width, considering padding and borders.
	 * Adjusts height depending on the screen width.
	 */
	const setCanvasDimensions = () => {
		if (sigCanvas.current) {
			const canvas = sigCanvas.current.getCanvas();
			const parent = canvas.parentNode;

			const style = getComputedStyle(parent);
			const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
			const borderX = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
			const elementWidth = parent.offsetWidth - paddingX - borderX;

			// Set width considering padding and border
			canvas.width = elementWidth;

			// Determine height based on screen width
			if (window.innerWidth <= 600) {
				canvas.height = 150;
			} else {
				canvas.height = elementWidth / 4;  // Using the adjusted width to determine height
			}
		}
	};

	/**
	 * Effect hook to initialize the canvas dimensions and attach an event listener for window resizing.
	 */
	useEffect(() => {
		setCanvasDimensions();
		window.addEventListener('resize', setCanvasDimensions);
		return () => {
			window.removeEventListener('resize', setCanvasDimensions);
		}
	}, []);

	/**
	 * Expose the clear and accept methods to the parent component via the forwarded ref.
	 */
	useImperativeHandle(ref, () => ({
		clear: () => {
			sigCanvas.current.clear();
			setIsSigned(false);
			setAcceptedSignature(null);
		},
		accept: () => {
			if (sigCanvas.current && !acceptedSignature) {
				const signatureDataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
				props.onAccept(signatureDataUrl);
				setAcceptedSignature(signatureDataUrl);
				setIsSigned(true);
			}
		}
	}));

	return (
		<div className="signature-container">
			<SignatureCanvas
				ref={sigCanvas}
				canvasProps={{
					className: 'signature-canvas'
				}}
				onEnd={() => setIsSigned(true)}
			/>
			<div className="button-container">
				<button onClick={() => ref.current.clear()}>Clear</button>
				<button onClick={() => ref.current.accept()} disabled={!isSigned}>Accept Signature</button>
			</div>
		</div>
	);
});

export default Signature;
