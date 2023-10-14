import React, { useState, useCallback } from 'react';
import CameraCapture from './CameraCapture';

const ItemFulfillment = ({ details }) => {
  const [capturedImage, setCapturedImage] = useState(null);

  const handleImageCapture = useCallback((imageSrc) => {
    setCapturedImage(imageSrc);
    // TODO: Here you can add logic to send imageSrc to the backend and associate it with the current item fulfillment record. 
  }, []);

  return (
    <div>
      <h2>Item Details:</h2>
      <table className="detailsTable">
        <tbody>
          {Object.entries(details).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>
                {typeof value === 'object' && value !== null
                  ? JSON.stringify(value)
                  : value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Integrating CameraCapture */}
      <h3>Capture an Image:</h3>
      <CameraCapture onCapture={handleImageCapture} />
    </div>
  );
};

export default ItemFulfillment;
