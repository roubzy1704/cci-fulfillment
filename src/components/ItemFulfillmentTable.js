import React from "react";

/**
 * A functional React component that renders a table displaying item fulfillments.
 *
 * @param {Object[]} items - An array of item fulfillment data.
 * @param {Function} onItemSelect - A callback function that is invoked when an item row is clicked to view its details.
 * @param {string|null} selectedItem - The currently selected item's ID. Used for styling purposes to highlight the selected row.
 * @param {Function} onRefresh - A callback function that is invoked to refresh the list of items.
 *
 * @returns {JSX.Element} A table of item fulfillments or a message if no items are available.
 */
const ItemFulfillmentTable = ({
	items,
	onItemSelect,
	selectedItem,
	onRefresh,
}) => {
	// If items are not available, return a message indicating no available items.
	if (!items || items.length === 0)
		return (
			<p>
				<strong>
					No Item fulfillments available. Please contact an Administrator.
				</strong>
			</p>
		);

	return (
		<div>
			<button className="refresh-button" onClick={onRefresh}>
				Refresh Items
			</button>
			<table>
				<thead>
					<tr>
						<th>Transaction ID</th>
						{/* //*Addition */}
						<th>Sales Order ID</th>
						{/* //*End Addition */}
						<th>Name</th>
						<th>Details</th>
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<tr
							key={item.id}
							className={selectedItem === item ? "selectedItem" : ""}
						>
							<td>{item.tranid}</td>
							{/* //*Addition */}
							<td>{item.createdfrom}</td>
							{/* //*End Addition */}
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
};

export default ItemFulfillmentTable;
