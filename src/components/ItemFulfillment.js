import React, { useState, useCallback, useRef } from 'react';
import CameraCapture from './CameraCapture';
import Signature from './Signature';
import '../css/ItemFulfillment.css';

const ItemFulfillment = ({ details }) => {
	const sigCanvas = useRef({});
	const [capturedImage, setCapturedImage] = useState(null);
	const [signatureImage, setSignatureImage] = useState(null);

	const handleSignatureAccept = (imgSrc) => {
		setSignatureImage(imgSrc);
		// TODO: Add logic to send imgSrc to the backend or use as desired.
	};
	const handleImageCapture = useCallback((imageSrc) => {
		setCapturedImage(imageSrc);
		// TODO: Logic to send imageSrc to backend...
	}, []);

	return (
		<div>
			<h2>Item Details:</h2>
			<div className="responsive-table-container">
				<div>
					<table className="detailsTable">
						<tbody>
							{Object.entries(details).map(([key, value]) => (
								<tr key={key} className="item-fulfillment-row">
									<td>{key}</td>
									<td>
										{typeof value === 'object' && value !== null
											? JSON.stringify(value)
											: value}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div>
					<h3>Request Signature:</h3>
					<Signature ref={sigCanvas} onAccept={handleSignatureAccept} />
					{signatureImage &&
						<div className="signature-display-container">
							<img src={signatureImage} alt="Accepted Signature" />
						</div>
					}
				</div>
				<div>
					<h3>Capture an Image:</h3>
					<CameraCapture onCapture={handleImageCapture} />
				</div>
			</div>
		</div>
	);
};

export default ItemFulfillment;
