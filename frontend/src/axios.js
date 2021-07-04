import axios from 'axios';
import _ from 'lodash';

import { url, DEFAULT_ERROR_TEXT } from './utils/constants';
// import { DEFAULT_ERROR_TEXT } from './utils/text';
import { toast } from 'react-toastify';

axios.defaults.baseURL = url;
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.delete['Content-Type'] = 'application/json';


axios.interceptors.request.use((request) => {
    return request;
});

const errorHandler = (error) => {
    // https://gist.github.com/saqueib/a495af17d7c0e2fd5c2316b0822ebac3

    // if has response show the error
    console.error(error);

    let message = DEFAULT_ERROR_TEXT;

    if (error.response) {
        console.log(error.response.data);
        message = _.get(error, 'response.data.message') || DEFAULT_ERROR_TEXT;
        return error.response;
    }

    toast.error(message);

    return Promise.reject({ ...error })
}

const responseHandler = (response) => {
    return response;
}

axios.interceptors.response.use(responseHandler, errorHandler);
