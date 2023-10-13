import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, maxPages }) => (
	<div>
		<button onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))} disabled={currentPage === 1}>
			Previous
		</button>
		<button onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, maxPages))} disabled={currentPage === maxPages}>
			Next
		</button>
	</div>
);

export default Pagination;
