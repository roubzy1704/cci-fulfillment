import React, { useState, useCallback, useRef, useEffect } from "react";
import CameraCapture from "./CameraCapture";
import Signature from "./Signature";
import axios from "axios";
import "../css/ItemFulfillment.css";

/**
 * ItemFulfillment Component
 *
 * This component handles the image capture and signature collection processes related to
 * an item fulfillment activity, and then uploads the images to a server.
 *
 * @param {Object} details - The details of the item fulfillment.
 * @param {Function} onRefresh - Callback to refresh the parent component or UI.
 * @param {Object} data - Additional data that may be used for server operations.
 */
const ItemFulfillment = ({ details = {}, onRefresh, data }) => {
	const sigCanvas = useRef({});

	// State variables
	const [itemFulfillmentId, setItemFulfillmentId] = useState(null);
	const [itemFulfillmentRecordId, setItemFulfillmentRecordId] = useState(null);
	const [capturedImage, setCapturedImage] = useState(null);
	// * Addition
	const [capturedName, setCapturedName] = useState("");
	//* End Addition
	const [signatureImage, setSignatureImage] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState(null);
	const [uploadedUrls, setUploadedUrls] = useState([]);
	const [errorMessage, setErrorMessage] = useState(null);
	const [showDetails, setShowDetails] = useState(true);
	const [isProcessItemButtonDisabled, setIsProcessItemButtonDisabled] =
		useState(false);
	const [updateItemFulfillmentResponse, setUpdateItemFulfillmentResponse] =
		useState(null);

	// Server URI from environment variables
	const expressServerRootUri = process.env.REACT_APP_EXPRESS_SERVER_ROOT_URI;

	/**
	 * Convert a data URL to a Blob object.
	 *
	 * @param {string} dataURL - The data URL to convert.
	 * @returns {Blob} The resulting Blob object.
	 */
	const dataURLToBlob = (dataURL) => {
		const byteString = atob(dataURL.split(",")[1]);
		const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: mimeString });
	};

	/**
	 * Handle the process of uploading images to the server.
	 */
	const handleUpload = async () => {
		if (!signatureImage) {
			setErrorMessage("Please provide a signature before submitting.");
			return;
		}
		if (!capturedImage) {
			setErrorMessage("Please capture an image before submitting.");
			return;
		}

		try {
			setUploading(true);
			setErrorMessage(null);
			const formData = new FormData();

			const signatureBlob = dataURLToBlob(signatureImage);
			const signatureFile = `${itemFulfillmentId}_signature.png`;
			formData.append("files", signatureBlob, signatureFile);

			const capturedImageBlob = dataURLToBlob(capturedImage);
			const pictureFile = `${itemFulfillmentId}_picture.png`;
			formData.append("files", capturedImageBlob, pictureFile);

			const response = await axios.post(
				`${expressServerRootUri}/api/uploadToS3`,
				formData
			);
			if (response.status === 200 && response.data && response.data.urls) {
				setUploadStatus("Images uploaded successfully.");
				setUploadedUrls(response.data.urls);
			} else {
				setUploadStatus("Failed to upload images.");
			}
		} catch (error) {
			setUploadStatus(`Upload error: ${error.message}`);
		} finally {
			setUploading(false);
		}
	};

	/**
	 * Callback to handle accepting a signature.
	 *
	 * @param {string} imgSrc - The source URL of the accepted signature image.
	 */
	const handleSignatureAccept = (imgSrc) => {
		setSignatureImage(imgSrc);
	};

	/**
	 * Callback to handle image capture.
	 *
	 * @param {string} imageSrc - The source URL of the captured image.
	 */
	const handleImageCapture = (imageSrc) => {
		setCapturedImage(imageSrc);
	};

	/**
	 * Handle hiding details and refreshing the parent component/UI.
	 */
	const handleDetailsAndRefresh = () => {
		setShowDetails(false);
		onRefresh && onRefresh();
	};

	/**
	 * Update the item fulfillment record on the server with the captured image
	 * and signature URLs.
	 */
	//TODO Add name to update
	const updateItemFulfillment = async () => {
		setIsProcessItemButtonDisabled(true);
		try {
			// Filter the URLs based on naming convention
			const capturedImageUrl = uploadedUrls.find((url) =>
				url.includes("picture")
			);
			const signatureImageUrl = uploadedUrls.find((url) =>
				url.includes("signature")
			);

			// Defining payload
			const payload = {
				data: data,
				id: itemFulfillmentRecordId,
				capturedImage: capturedImageUrl,
				signatureImage: signatureImageUrl,
				//* Addition
				signerName: capturedName,
				// *End Addition
			};

			const response = await axios.post(
				`${expressServerRootUri}/api/updateItemFulfillmentRecord`,
				payload
			);
			if (response.status === 200) {
				setUpdateItemFulfillmentResponse(
					response.data.message || "Successfully updated."
				);
			} else {
				setIsProcessItemButtonDisabled(true);
				setUpdateItemFulfillmentResponse("Error updating ItemFulfillment.");
			}
		} catch (error) {
			setIsProcessItemButtonDisabled(true);
			setUpdateItemFulfillmentResponse(`Error: ${error.message}`);
		}
	};

	// These fields and labels are used for displaying item details in a table format.
	const fieldsToDisplay = [
		"custbody1",
		"tranId",
		"tranDate",
		"orderType",
		"shipAddress",
	];
	const fieldLabels = {
		custbody1: "Seller",
		tranId: "Transaction ID",
		tranDate: "Transaction Date",
		orderType: "Order Type",
		shipAddress: "Shipping Address",
	};

	/**
	 * Side effect to initialize itemFulfillmentId and itemFulfillmentRecordId
	 * based on the details prop when the component mounts.
	 */
	useEffect(() => {
		setItemFulfillmentId(details.tranId);
		setItemFulfillmentRecordId(details.id);
	}, [details.id, details.tranId]);

	return (
		<div>
			{showDetails ? (
				<div>
					<h2>Item Details:</h2>
					<div className="responsive-table-container">
						<table className="detailsTable">
							<tbody>
								{fieldsToDisplay.map(
									(field) =>
										details[field] !== undefined && (
											<tr key={field} className="item-fulfillment-row">
												<td>{fieldLabels[field] || field}</td>
												<td>{details[field]}</td>
											</tr>
										)
								)}
								<tr>
									<td colSpan="2">
										<h3>Request Signature:</h3>
										<Signature
											ref={sigCanvas}
											onAccept={handleSignatureAccept}
										/>
										{signatureImage && (
											<div className="signature-display-container">
												<img src={signatureImage} alt="Accepted Signature" />
											</div>
										)}
									</td>
								</tr>
								{/* //* Addition */}
								<tr>
									<td colSpan="2">
										<label>Signer</label>
										{
											<div className="signature-display-container">
												<input
													name="myInput"
													placeholder="N/A"
													type="text"
													value={capturedName}
													onChange={(event) => {
														setCapturedName(event.target.value);
													}}
												/>
											</div>
										}
									</td>
								</tr>
								{/* //*End Addition */}
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
												<button onClick={handleUpload} disabled={uploading}>
													Save Images in Storage.
												</button>
											</div>
											{uploading && <p>Uploading...</p>}
											{uploadStatus && <p>{uploadStatus}</p>}
											{uploadedUrls.length > 0 && (
												<div>
													<div>
														<h4>Uploaded Files:</h4>
														<ul>
															{uploadedUrls.map((url, index) => (
																<li key={index}>
																	<a
																		href={url}
																		target="_blank"
																		rel="noopener noreferrer"
																	>
																		{url}
																	</a>
																</li>
															))}
														</ul>
													</div>
													<div className="button-container">
														<button
															onClick={updateItemFulfillment}
															disabled={isProcessItemButtonDisabled}
														>
															Process Item Fulfillment.
														</button>
														{updateItemFulfillmentResponse && (
															<>
																<p>
																	<strong>
																		{updateItemFulfillmentResponse}
																	</strong>
																</p>
																{onRefresh && (
																	<button onClick={handleDetailsAndRefresh}>
																		Close Item Fulfillment and refresh list.
																	</button>
																)}
															</>
														)}
													</div>
												</div>
											)}
											{errorMessage && (
												<p className="error-message">{errorMessage}</p>
											)}
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			) : (
				// Render a message or an empty div when details are hidden
				<div></div>
			)}
		</div>
	);
};

export default ItemFulfillment;
