import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ItemFulfillmentTable from './components/ItemFulfillmentTable';
import ItemFulfillment from './components/ItemFulfillment';
import Pagination from './components/Pagination';
import './css/App.css';
import './css/Sidebar.css';

const apiCall = async (endpoint, headers = {}) => {
	try {
		const response = await axios.get(endpoint, { headers });
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
	const itemsPerPage = 10;
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

	const fetchItemFulfillmentData = async (token) => {
		const [data, err] = await apiCall(`${expressServerRootUri}/api/getItemFulfillmentDataSuiteQL`, {
			'Authorization': `Bearer ${token}`
		});
		if (data) {
			setItemFulfillmentData(data.items.map(item => item.id));
		} else {
			setError(err);
		}
	};

	const fetchItemDetails = async (id) => {
		const [data, err] = await apiCall(`${expressServerRootUri}/api/getItemFulfillmentRecord?id=${id}`);
		if (data) {
			setSelectedItemDetails(data);
			setSelectedItemId(data.id)
		} else {
			setError(err);
		}
	};

	useEffect(() => {
		const getToken = async () => {
			const [data, err] = await apiCall(`${expressServerRootUri}/gettoken`);
			if (data) {
				setTokenData(data);
				fetchItemFulfillmentData(data.access_token);
			} else {
				setError(err);
			}
		};

		if (window.location.pathname === '/dashboard') {
			getToken();
		}
	}, []);

	const handleItemSelect = (item) => {
		setActiveItem(item);
	};

	return (
		<div>
			<Header />
			<Sidebar items={menuItems} activeItem={activeItem} onItemSelect={handleItemSelect} />
			<main>
				{error ? <div>Error occurred: {error.message}</div> :
					tokenData ? (
						<div>
							<ItemFulfillmentTable items={displayedItems} onItemSelect={fetchItemDetails} selectedItem={selectedItemId} />
							<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} maxPages={maxPages} />
							{selectedItemDetails && <ItemFulfillment key={selectedItemId} details={selectedItemDetails} />}
						</div>
					) : <button onClick={handleLogin}>Login with NETSUITE - COMPETITIVE CHOICE</button>
				}
			</main>
		</div>
	);
}

export default App;
