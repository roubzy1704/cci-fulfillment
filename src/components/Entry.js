import React from 'react';

const Entry = ({ entry }) => (
  <div>
    <p>Date: {entry.date}</p>
    <p>Project: {entry.project}</p>
    <p>Time: {entry.time}</p>
  </div>
);

export default Entry;
