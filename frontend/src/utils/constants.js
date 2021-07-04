require("dotenv").config();

export const url = "http://localhost:" + process.env.REACT_APP_BACKEND_PORT;

// General POST error
export const DEFAULT_ERROR_TEXT = 'An error occured. Try again later';

// Specific GET errors (deprecated)
export const CHANNEL_ERROR_TEXT = 'Unable to retrieve channel information';
