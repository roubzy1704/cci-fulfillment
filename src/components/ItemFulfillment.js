import React from 'react';

const ItemFulfillment = ({ details }) =>
(
	<div>
		<h2>Item Details:</h2>
		<table className="detailsTable">
			<tbody>
				{Object.entries(details).map(([key, value]) => (
					<tr key={key}>
						<td>{key}</td>
						<td>
							{typeof value === 'object' && value !== null
								? JSON.stringify(value)  // Convert object to string for rendering
								: value}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default ItemFulfillment;
