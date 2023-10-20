import React from 'react';

const ItemFulfillmentTable = ({ items, onItemSelect, selectedItem, onRefresh }) => {
    // If items are not available, return null (i.e., don't render anything)
    if (!items || items.length === 0) return null;

    return (
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
                    {items.map(item => (
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
};

export default ItemFulfillmentTable;
