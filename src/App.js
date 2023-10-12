import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './css/App.css';
import './css/Sidebar.css';

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
	const expressServerRootUri= process.env.REACT_APP_EXPRESS_SERVER_ROOT_URI;

	const displayedItems = itemFulfillmentData?.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleLogin = () => {
		window.location.href = `${expressServerRootUri}/auth`;
	};

	const fetchItemFulfillmentData = async (token) => {
		try {
			const response = await axios.get(`${expressServerRootUri}/api/getItemFulfillmentData`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			setItemFulfillmentData(response.data.items.map(item => item.id));
		} catch (err) {
			console.error("Failed to fetch customer data:", err);
		}
	};

	const fetchItemDetails = async (id) => {
		try {
			const response = await axios.get(`${expressServerRootUri}/api/getItemFulfillmentRecord?id=${id}`);
			setSelectedItemDetails(response.data);
		} catch (err) {
			console.error("Failed to fetch item details:", err);
		}
	};

	useEffect(() => {
		const getToken = async () => {
			try {
				const response = await axios.get(`${expressServerRootUri}/gettoken`);
				setTokenData(response.data);
				fetchItemFulfillmentData(response.data.access_token);
			} catch (err) {
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
			<Sidebar
				items={menuItems}
				activeItem={activeItem}
				onItemSelect={handleItemSelect}
			/>
			<main>
				{error
					? <div>Error occurred: {error.message}</div>
					: tokenData
						? <div>
							Token: {tokenData.access_token}
							{displayedItems && (
								<div>
									<h2>ItemFulfillment Data:</h2>
									<table>
										<thead>
											<tr>
												<th>Item ID</th>
												<th>Details</th>
											</tr>
										</thead>
										<tbody>
											{displayedItems.map(item => (
												<tr
													key={item}
													className={selectedItemId === item ? 'selectedItem' : ''}
												>
													<td>{item}</td>
													<td>
														<button onClick={() => {
															fetchItemDetails(item);
															setSelectedItemId(item);
														}}>
															View Details
														</button>
													</td>
												</tr>
											))}
										</tbody>

									</table>
									<button onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}>
										Previous
									</button>
									<button onClick={() => setCurrentPage(prevPage => prevPage + 1)}>
										Next
									</button>
								</div>
							)}
							{selectedItemDetails && (
								<div>
									<h2>Item Details:</h2>
									<table className="detailsTable">
										<tbody>
											<tr>
												<td>Created Date</td>
												<td>{selectedItemDetails.createdDate}</td>
											</tr>
											<tr>
												<td>Created From</td>
												<td>{selectedItemDetails.createdFrom.refName}</td>
											</tr>
											<tr>
												<td>Order ID</td>
												<td>{selectedItemDetails.orderId}</td>
											</tr>
											<tr>
												<td>Order Type</td>
												<td>{selectedItemDetails.orderType}</td>
											</tr>
											<tr>
												<td>Ship Status</td>
												<td>{selectedItemDetails.shipStatus.refName}</td>
											</tr>
											<tr>
												<td>Shipping Address</td>
												<td>{selectedItemDetails.shipAddress}</td>
											</tr>
											<tr>
												<td>Tran Date</td>
												<td>{selectedItemDetails.tranDate}</td>
											</tr>
											<tr>
												<td>Transaction ID</td>
												<td>{selectedItemDetails.tranId}</td>
											</tr>
											{/* Add more rows as required */}
										</tbody>
									</table>
								</div>
							)}
						</div>
						: <button onClick={handleLogin}>Login with NETSUITE - COMPETITIVE CHOICE</button>
				}
			</main>
		</div>
	);
}

export default App;
