import React, { useState, useCallback, useRef, useEffect } from 'react';
import CameraCapture from './CameraCapture';
import Signature from './Signature';
import axios from 'axios';
import '../css/ItemFulfillment.css';

const ItemFulfillment = ({ details = {} }) => {
	const sigCanvas = useRef({});
	const [itemFulfillmentId, setItemFulfillmentId] = useState(null);
	const [capturedImage, setCapturedImage] = useState(null);
	const [signatureImage, setSignatureImage] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState(null);
	const [uploadedUrls, setUploadedUrls] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const expressServerRootUri = process.env.REACT_APP_EXPRESS_SERVER_ROOT_URI;

	const dataURLToBlob = (dataURL) => {
		const byteString = atob(dataURL.split(',')[1]);
		const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: mimeString });
	};

	const handleUpload = async () => {
		if (!signatureImage) {
			setErrorMessage('Please provide a signature before submitting.');
			return;
		}
		if (!capturedImage) {
			setErrorMessage('Please capture an image before submitting.');
			return;
		}

		try {
			setUploading(true);
			setErrorMessage(null);
			const formData = new FormData();

			const signatureBlob = dataURLToBlob(signatureImage);
			const signatureFile = `${itemFulfillmentId}_signature.png`;
			formData.append('files', signatureBlob, signatureFile);

			const capturedImageBlob = dataURLToBlob(capturedImage);
			const pictureFile = `${itemFulfillmentId}_picture.png`;
			formData.append('files', capturedImageBlob, pictureFile);

			const response = await axios.post(`${expressServerRootUri}/api/uploadToS3`, formData);
			if (response.status === 200 && response.data && response.data.urls) {
				setUploadStatus('Images uploaded successfully.');
				setUploadedUrls(response.data.urls);
			} else {
				setUploadStatus('Failed to upload images.');
			}
		} catch (error) {
			setUploadStatus(`Upload error: ${error.message}`);
		} finally {
			setUploading(false);
		}
	};

	const handleSignatureAccept = (imgSrc) => {
		setSignatureImage(imgSrc);
	};

	const handleImageCapture = (imageSrc) => {
		setCapturedImage(imageSrc);
	};

	const fieldsToDisplay = ['custbody1', 'tranId', 'tranDate', 'orderType', 'shipAddress'];
	const fieldLabels = {
		custbody1: 'Seller',
		tranId: 'Transaction ID',
		tranDate: 'Transaction Date',
		orderType: 'Order Type',
		shipAddress: 'Shipping Address'
	};
	useEffect(() => {
		// Set itemFulfillmentId when the component mounts
		setItemFulfillmentId(details.tranId);
	}, [details.tranId]);

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
						<tr>
							<td colSpan="2">
								<div className="upload-section">
									<div className="button-container">
										<button
											onClick={handleUpload}
											disabled={uploading}
										>
											Submit Item Fulfillment
										</button>
									</div>
									{uploading && <p>Uploading...</p>}
									{uploadStatus && <p>{uploadStatus}</p>}
									{uploadedUrls.length > 0 &&
										<div>
											<h4>Uploaded Files:</h4>
											<ul>
												{uploadedUrls.map((url, index) => (
													<li key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
												))}
											</ul>
										</div>
									}
									{errorMessage && <p className="error-message">{errorMessage}</p>}
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ItemFulfillment;
