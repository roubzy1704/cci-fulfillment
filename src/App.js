import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import ItemFulfillmentTable from './components/ItemFulfillmentTable';
import ItemFulfillment from './components/ItemFulfillment';
import Pagination from './components/Pagination';
import './css/App.css';

/**
 * A generic asynchronous utility function that interacts with a specified API endpoint.
 * 
 * @param {string} endpoint - API endpoint URL.
 * @param {Object} [params={}] - Parameters to pass along with the API request.
 * @returns {[Object, Error]} - An array containing the data from the API or the error that occurred.
 */
const apiCall = async (endpoint, params = {}) => {
	try {
		const response = await axios.get(endpoint, { params }, { withCredentials: true });
		return [response.data, null];
	} catch (error) {
		return [null, error];
	}
};

const App = () => {
	// State to hold the authentication token.
	const [tokenData, setTokenData] = useState(null);

	// State to hold item fulfillment data.
	const [itemFulfillmentData, setItemFulfillmentData] = useState(null);

	// State to hold the details of the selected item.
	const [selectedItemDetails, setSelectedItemDetails] = useState(null);

	// State to hold the ID of the selected item.
	const [selectedItemId, setSelectedItemId] = useState(null);

	// State to hold any error message.
	const [error, setError] = useState(null);

	// State for the current page in the pagination.
	const [currentPage, setCurrentPage] = useState(1);

	// Number of items to be shown per page.
	const itemsPerPage = process.env.REACT_APP_PAGINATION_ITEMS_LIMIT_PER_PAGE;

	// Base URI for the Express server.
	const expressServerRootUri = process.env.REACT_APP_EXPRESS_SERVER_ROOT_URI;

	// Calculate the maximum number of pages for pagination.
	const maxPages = Math.ceil((itemFulfillmentData?.length || 0) / itemsPerPage);

	// Get the items to be displayed on the current page.
	const displayedItems = itemFulfillmentData?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Function to redirect user to the authentication page.
	const handleLogin = () => {
		window.location.href = `${expressServerRootUri}/auth`;
	};

	// Function to refresh items.
	const handleRefreshItems = () => {
		fetchItemFulfillmentData(tokenData);
	};

	// Function to fetch item fulfillment data using the provided token.
	const fetchItemFulfillmentData = async (token) => {
		const [data, err] = await apiCall(`${expressServerRootUri}/api/getItemFulfillmentDataSuiteQL`, {
			data: token
		});
		if (data) {
			setItemFulfillmentData(data.items.map(item => ({ id: item.id, tranid: item.tranid, description: item.trandisplayname })));
		} else {
			setError(err);
		}
	};

	// Function to fetch details of an item given its ID and token.
	const fetchItemDetails = async (id, token) => {
		const [data, err] = await apiCall(`${expressServerRootUri}/api/getItemFulfillmentRecord?id=${id}`, {
			data: token
		});
		if (data) {
			setSelectedItemDetails(data);
			setSelectedItemId(data.id)
		} else {
			setError(err);
		}
	};

	// Use effect hook to extract data from the URL (if present) when the component mounts.
	useEffect(() => {
		const path= window.location.pathname;
		if (path.includes('/dashboard')) {
			// Extract data from URL if present
			const urlParams = new URLSearchParams(window.location.search);
			const dataFromRedirect = urlParams.get('data');
			if (dataFromRedirect) {
				const extractedData = decodeURIComponent(dataFromRedirect);
				setTokenData(extractedData);
				fetchItemFulfillmentData(extractedData);
			}
		}
	}, []);

	// Component rendering logic.
	return (
		<div className="app-container">
			<Header isLoggedIn={!!tokenData} />
			<main className="main-content">
				{error ? <div className="error-message">Error occurred: {error.message}</div> :
					tokenData ? (
						<div className="content-container">
							<ItemFulfillmentTable
								className="item-fulfillment-table"
								items={displayedItems}
								onItemSelect={(itemId) => fetchItemDetails(itemId, tokenData)}
								selectedItem={selectedItemId}
								onRefresh={handleRefreshItems}
							/>
							{/* Render Pagination only if there are items */}
							{itemFulfillmentData && itemFulfillmentData.length > 0 && (
								<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} maxPages={maxPages} />
							)}
							{selectedItemDetails && <ItemFulfillment key={selectedItemId} details={selectedItemDetails} onRefresh={handleRefreshItems} data={tokenData} />}
						</div>
					) : <button className="login-button" onClick={handleLogin}>Login with NETSUITE - COMPETITIVE CHOICE</button>
				}
			</main>
		</div>
	);
}

export default App;
