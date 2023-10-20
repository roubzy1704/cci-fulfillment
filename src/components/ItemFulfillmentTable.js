import React from 'react';

const ItemFulfillmentTable = ({ items, onItemSelect, selectedItem, onRefresh }) =>
(
	<div>
		<button className="refresh-button" onClick={onRefresh}>Refresh Items</button>
		<table>
			<thead>
				<tr>
					<th>Transaction ID</th>
					<th>Name</th>
					<th>Details</th>
				</tr>
			</thead>
			<tbody>
				{items && items.map(item => (
					<tr key={item.id} className={selectedItem === item ? 'selectedItem' : ''}>
						<td>{item.tranid}</td>
						<td>{item.description}</td>
						<td>
							<button onClick={() => onItemSelect(item.id)}>
								View Details
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);
export default ItemFulfillmentTable;