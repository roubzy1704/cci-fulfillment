import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import ItemFulfillmentTable from './components/ItemFulfillmentTable';
import ItemFulfillment from './components/ItemFulfillment';
import Pagination from './components/Pagination';
import './css/App.css';
import './css/Sidebar.css';

const apiCall = async (endpoint, params = {}) => {
	try {
		const response = await axios.get(endpoint, { params }, { withCredentials: true });
		return [response.data, null];
	} catch (error) {
		return [null, error];
	}
};

function App() {
	const [tokenData, setTokenData] = useState(null);
	const [itemFulfillmentData, setItemFulfillmentData] = useState(null);
	const [selectedItemDetails, setSelectedItemDetails] = useState(null);
	const [selectedItemId, setSelectedItemId] = useState(null);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = process.env.REACT_APP_PAGINATION_ITEMS_LIMIT_PER_PAGE;
	const [menuItems] = useState([{ id: '1', label: 'Option 1' }]);
	const [activeItem, setActiveItem] = useState(menuItems[0]);
	const expressServerRootUri = process.env.REACT_APP_EXPRESS_SERVER_ROOT_URI;

	const maxPages = Math.ceil((itemFulfillmentData?.length || 0) / itemsPerPage);

	const displayedItems = itemFulfillmentData?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleLogin = () => {
		window.location.href = `${expressServerRootUri}/auth`;
	};

	const handleRefreshItems = () => {
		fetchItemFulfillmentData(tokenData);
	};

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

	useEffect(() => {
		if (window.location.pathname === '/dashboard') {
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

	const handleItemSelect = (item) => {
		setActiveItem(item);
	};

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
