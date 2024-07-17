// import moment from "moment";
import { apiUrls } from "@/consts";

export const numberFormat = (number: any = 0, precision = 4) => {
    if (number === '' || parseFloat(number) <= 0) {
        return 0;
    }
    return number.toLocaleString("en", { minimumFractionDigits: precision });
}

export const onCopyText = (value: string, toast: any = '') => {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (toast !== '' && typeof toast.success === "function")
        toast.success("Copied.")
}

const authorizationToken = "Bearer ";
let isCheckInternet = true;
export const callGetAPI = async (methodName: string, request: any = {}, extraHeaders = {}) => {

    if (!checkInternet() && isCheckInternet) {
        isCheckInternet = false;
        var closeInterval = setInterval(() => {
            if (checkInternet()) {
                clearIntervalForInternet(closeInterval);
            }
        }, 1000);
    } else if (!isCheckInternet) {
        return false;
    } else {

        let headers = { Authorization: '' };
        if (localStorage.getItem("ac") !== null && localStorage.getItem("ac") !== '') {
            headers.Authorization = authorizationToken + localStorage.getItem('ac');
        } else if (localStorage.getItem("temp_ac") !== null && localStorage.getItem("temp_ac") !== '') {
            headers.Authorization = authorizationToken + localStorage.getItem('temp_ac');
        }

        if (typeof extraHeaders === 'object') {
            headers = { ...headers, ...extraHeaders };
        }

        if (apiUrls[methodName] === undefined) {
            return staticResponseObj(9999999);
        }

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        let response = {};
        try {
            const responseObj = await fetch(apiUrls[methodName] + (request.data !== undefined ? request.data : ''), options);
            if (responseObj.ok) {
                response = await responseObj.json();
            } else {
                response = staticResponseObj(responseObj.status);
            }
        } catch (error) {
            response = staticResponseObj(9999999);
        }

        return response;
    }
}

export const callPostAPI = async (methodName: string, request = {}, extraHeaders = {}) => {

    if (!checkInternet() && isCheckInternet) {
        isCheckInternet = false;
        var closeInterval = setInterval(() => {
            if (checkInternet()) {
                clearIntervalForInternet(closeInterval);
            }
        }, 1000);
    } else if (!isCheckInternet) {
        return false;
    } else {

        let headers = { Authorization: '' };
        if (localStorage.getItem("ac") !== null && localStorage.getItem("ac") !== '') {
            headers.Authorization = authorizationToken + localStorage.getItem('ac');
        } else if (localStorage.getItem("temp_ac") !== null && localStorage.getItem("temp_ac") !== '') {
            headers.Authorization = authorizationToken + localStorage.getItem('temp_ac');
        }

        if (typeof extraHeaders === 'object') {
            headers = { ...headers, ...extraHeaders };
        }

        if (apiUrls[methodName] === undefined) {
            return staticResponseObj(9999999);
        }

        let apiRequest = Object.assign({}, request);
        /* Encryption process start, first add timestamp as date format and then again change timestamp to original */
        /* let tData = getNonce();
        if (typeof apiRequest !== "object" || apiRequest.data === undefined) {
            apiRequest = { data: { timestamp: tData.formattedDate } }
        } else {
            apiRequest.data.timestamp = tData.formattedDate;
        }
        apiRequest.sign = ecbys2s6(apiRequest.data); // call function for encryption payload data ans set into sign param
        apiRequest.data.timestamp = tData.formattedTs; */
        /* end encryption */

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(apiRequest),
        };

        let response = {};
        try {
            const callCreateOrder = await fetch(apiUrls[methodName], options);
            if (callCreateOrder.ok) {
                response = await callCreateOrder.json();
            } else {
                response = staticResponseObj(9999999);
            }
        } catch (error) {
            console.log("error", error)
            response = staticResponseObj(9999999);
        }

        return response;
    }
}

function clearIntervalForInternet(closeInterval: any) {
    clearInterval(closeInterval);
    window.location.reload();
}

function checkInternet() {
    return navigator.onLine ? true : false;
}

function staticResponseObj(statusCode: number) {
    var response = {
        ErrorCode: statusCode,
        ReturnCode: 1,
        ReturnMsg: "Please try after sometime.",
        statusCode: statusCode,
        returnCode: 1,
        errorCode: statusCode,
        status: 1
    };
    return response;
}