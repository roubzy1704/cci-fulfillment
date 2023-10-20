import React, { useState, useCallback, useRef } from 'react';
import CameraCapture from './CameraCapture';
import Signature from './Signature';
import '../css/ItemFulfillment.css';

const ItemFulfillment = ({ details = {} }) => {
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

	// List of fields to display
	const fieldsToDisplay = ['custbody1', 'tranId', 'tranDate', 'orderType', 'shipAddress'];

	// Mapping of fields to their respective display labels
	const fieldLabels = {
		custbody1: 'Seller',
		tranId: 'Transaction ID',
		tranDate: 'Transaction Date',
		orderType: 'Order Type',
		shipAddress: 'Shipping Address'
	};

	return (
		<div>
			<h2>Item Details:</h2>
			<div className="responsive-table-container">
				<table className="detailsTable">
					<tbody>
						{fieldsToDisplay.map((field) => (
							details[field] !== undefined && (
								<tr key={field} className="item-fulfillment-row">
									<td>{fieldLabels[field] || field}</td>
									<td>{details[field]}</td>
								</tr>
							)
						))}
						<tr>
							<td colSpan="2">
								<h3>Request Signature:</h3>
								<Signature ref={sigCanvas} onAccept={handleSignatureAccept} />
								{signatureImage &&
									<div className="signature-display-container">
										<img src={signatureImage} alt="Accepted Signature" />
									</div>
								}
							</td>
						</tr>
						<tr>
							<td colSpan="2">
								<h3>Capture an Image:</h3>
								<CameraCapture onCapture={handleImageCapture} />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ItemFulfillment;
