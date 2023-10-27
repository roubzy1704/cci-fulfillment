# CCI Fulfillment Application

This project is a React-based application designed to manage CCI Fulfillment operations. It encompasses several components to streamline tasks such as user authentication, item fulfillment management, camera interactions, pagination, and signature capture.

## Components Overview

### 1. **App.js**
- **Description**: 
    - The root component of the application.
- **Functionality**: 
    - Initializes the application structure and manages core routing and layout.

### 2. **ItemFulfillmentTable.js**
- **Description**: 
    - A component for displaying a table of items.
- **Functionality**: 
    - Provides a clear view of items with relevant details and offers a way to filter and sort the displayed items.

### 3. **ItemFulfillment.js**
- **Description**: 
    - Displays individual item details and provides functionalities related to item fulfillment.
- **Functionality**: 
    - Manages the state and logic related to each item.

### 4. **Pagination.js**
- **Description**: 
    - A pagination component.
- **Functionality**: 
    - Enables the user to navigate between different sets of items in the `ItemFulfillmentTable`.

### 5. **CameraCapture.js**
- **Description**: 
    - Component for capturing images via the user's camera.
- **Functionality**: 
    - Can start/stop the camera, and capture images.

### 6. **Signature.js**
- **Description**: 
    - A digital signature component.
- **Functionality**: 
    - Allows users to draw and accept a signature.

### 7. **Header.js**
- **Description**: 
    - The header component for the application.
- **Functionality**: 
    - Displays the application title and provides a logout option if the user is logged in.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!