import React from 'react';

const ItemFulfillmentTable = ({ items, onItemSelect, selectedItem }) =>
(
	<table>
		<thead>
			<tr>
				<th>Item ID</th>
				<th>Details</th>
			</tr>
		</thead>
		<tbody>
			{items && items.map(item => (
				<tr key={item} className={selectedItem === item ? 'selectedItem' : ''}>
					<td>{item}</td>
					<td>
						<button onClick={() => onItemSelect(item)}>
							View Details
						</button>
					</td>
				</tr>
			))}
		</tbody>
	</table>
);
export default ItemFulfillmentTable;