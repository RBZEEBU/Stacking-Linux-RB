import {
    rpcUrl, waitlistContractAddress, ZBUContractAddress, TRN_STATUS_CHECK_INTERVAL, TRN_STATUS_CHECK_DELAY_SECONDS, delay,
    limitContractMethods
} from "@/consts";
import WaitlistABI from "./WaitlistABI.json";
import ZBUContractABI from "./ZeebuContractABI.json";
import { ethers } from "ethers";

let userDetailObject: any = "", /* referralDetailObject = "", */ userProvider: any = "", signer: any = ''/* , rateContractObj = '' */;
const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

export const initialContract = async (address = '') => {
    // userProvider = new ethers.providers.Web3Provider(window.ethereum);
    userProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
    signer = userProvider.getSigner(address);
    // signer = userProvider.getSigner();
    // const signer = userProvider.getSigner();
    userDetailObject = new ethers.Contract(waitlistContractAddress, WaitlistABI, signer);
    // console.log("userDetailObject", userDetailObject)
    // referralDetailObject = new ethers.Contract(referralContractAddress, ReferralContractABI, signer);
    // console.log("referralDetailObject", referralDetailObject)
}

export const clearContract = async () => {
    userProvider = signer = userDetailObject = /* referralDetailObject = */ "";
}

export const getRpcProviderObject = () => {
    return rpcProvider;
}
// ------------------------------------- User Program Start -----------------------------------

export const getUserDetail = async (address: string, isRpcCall: Boolean = false) => {

    try {

        let userContractDetail: any = "";
        if (isRpcCall) {
            userContractDetail = new ethers.Contract(waitlistContractAddress, WaitlistABI, rpcProvider);
        } else {
            userContractDetail = userDetailObject; // new ethers.Contract(waitlistContractAddress, WaitlistABI, userProvider);
        }
        const userContractDetailObj = await userContractDetail.users(address);
        // console.log("userContractDetailObj", userContractDetailObj)
        if (![null, undefined].includes(userContractDetailObj.email) && userContractDetailObj[2] !== undefined && userContractDetailObj[2] !== "0x0000000000000000000000000000000000000000") {
            return await convertUserDetailObject(userContractDetailObj);
        } else {
            return { found: false }
        }

    } catch (error) {
        console.log("getUserDetail error", error)
        return { found: false };
    }
}

export const registerToWaitlist = async (referralPerentAddress: string, email: string, isV1: Boolean = false) => {

    try {

        const providerGasPrice = await userProvider.getGasPrice();
        // const providerGasPrice = await userProvider.getFeeData();
        // console.log("providerGasPrice", providerGasPrice)
        const estimateGasRegisterResponse = await userDetailObject.estimateGas.registerUser(referralPerentAddress, email, { gasPrice: providerGasPrice });
        // console.log("estimateGasRegisterResponse", estimateGasRegisterResponse)
        const txData = await userDetailObject.populateTransaction.registerUser(
            referralPerentAddress, // Replace with a valid recipient address
            email, { gasPrice: providerGasPrice, gasLimit: parseFloat(estimateGasRegisterResponse) + 50000 }
        );
        // console.log("registerToWaitlist txData", txData);
        return { success: true, transactionObj: txData };

    } catch (error) {
        console.log("registerToWaitlist error", error)
        return { success: false, error };
    }

}

export const getZBUBalance = async (Address = '') => {
    try {
        const tokenContract = new ethers.Contract(ZBUContractAddress, ZBUContractABI, signer);
        const tokenBalance = await tokenContract.balanceOf(Address);
        const parseBalance = getNumberFromWei(String(tokenBalance));
        return parseBalance;
    } catch (e) {
        console.log("error in getZBUBalance", e)
        return 0;
    }
}

export const getNativeBalance = async (Address = '') => {
    try {
        // const balance = await window.ethereum.request({ method: "eth_getBalance", params: [Address, "latest"] })
        const balance = await userProvider.getBalance(Address);
        const parseBnbBalance = getNumberFromWei(String(balance))
        return parseBnbBalance;
    } catch (e) {
        console.log("error in getNativeBalance", e)
        return 0;
    }
}

// ------------------------------------- User Program End -----------------------------------

// ------------------------------------- Referral Program Start -----------------------------------

export const checkReferralCodeExists = async (referralCode: string, isRpcCall: Boolean = false) => {

    try {
        // let referralContractDetail = '';
        // if (isRpcCall || !referralDetailObject) {
        //     referralContractDetail = new ethers.Contract(referralContractAddress, ReferralContractABI, rpcProvider);
        // } else {
        //     referralContractDetail = referralDetailObject; // new ethers.Contract(waitlistContractAddress, WaitlistABI, userProvider);
        // }
        // // wait list contract or user object check => verifyReferralCode
        // const referralContractDetailObj = await referralContractDetail.getUserAddressByReferralCode(referralCode.toString());
        // return referralContractDetailObj.toString().length > 25 ? referralContractDetailObj : 9;
        // console.log("isRpcCall", isRpcCall)
        let referralDetail: any = '';
        if (isRpcCall) {
            referralDetail = new ethers.Contract(waitlistContractAddress, WaitlistABI, rpcProvider);
        } else {
            referralDetail = userDetailObject; // new ethers.Contract(waitlistContractAddress, WaitlistABI, userProvider);
        }
        // wait list contract or user object check => verifyReferralCode
        // const referralContractDetailObj = await referralContractDetail.getUserAddressByReferralCode(referralCode.toString());
        const referralDetailObj = await referralDetail.verifyReferralCode(referralCode.toString());
        // console.log("referralDetailObj", referralDetailObj)
        return referralDetailObj.toString().length > 25 ? referralDetailObj : 9;

    } catch (error) {
        console.log("checkReferralCodeExists error", error)
        return 9;
    }
}

export const getReferralCountByAddress = async (address: string) => {
    const referralCount = { active: 0, inActive: 0, suspended: 0 };
    try {
        const userReferralCount = await userDetailObject.referralUserStatus(address);
        if (![undefined, "", null].includes(userReferralCount.active)) {
            referralCount.active = parseInt(userReferralCount.active);
            referralCount.inActive = parseInt(userReferralCount.inactive);
            referralCount.suspended = parseInt(userReferralCount.suspended);
            return referralCount;
        } else {
            return referralCount;
        }
    } catch (error) {
        console.log("getReferralCountByAddress error", error);
        return referralCount;
    }
}

export const getReferralCodeByAddress = async (address: string) => {

    try {

        const referralCode = await userDetailObject.getUserCodeByAddress();
        // console.log("referralCode"), referralCode
        if (![null, "", undefined, 0, "0"].includes(referralCode) && referralCode.toNumber() !== 0)
            return referralCode;
        else
            return "";

    } catch (error) {
        console.log("getReferralCodeByAddress error", error)
        return "";
    }

}

export const generateReferralCodeByAddress = async (referralCode: string, isV1 = false) => {

    try {

        const providerGasPrice = await userProvider.getGasPrice();
        // console.log("providerGasPrice", providerGasPrice)
        const estimateGasGenReferralResponse = await userDetailObject.estimateGas.activateReferral(referralCode, { gasPrice: providerGasPrice });
        // console.log("estimateGasGenReferralResponse", estimateGasGenReferralResponse)
        const txData = await userDetailObject.populateTransaction.activateReferral(
            referralCode, // Replace with a valid referral code
            { gasPrice: providerGasPrice, gasLimit: parseFloat(estimateGasGenReferralResponse) + 50000 }
        );
        return { success: true, transactionObj: txData };

    } catch (error) {
        console.log("generateReferralCodeByAddress error", error);
        return { success: false };
    }

}

// ------------------------------------- Referral Program End -----------------------------------

export const getRewardDetailAndLimit = async (address: string) => {
    let rewardObj = { reward: 0, rewardLimit: 0 };
    try {

        const rewardResponse = await userDetailObject.rewards(address);
        // console.log("rewardResponse", rewardResponse)
        rewardObj.reward = getNumberFromWei(rewardResponse);

        const rewardLimitResponse = await userDetailObject.maxRewardPoints();
        // console.log("rewardLimitResponse", rewardLimitResponse)
        rewardObj.rewardLimit = getNumberFromWei(rewardLimitResponse);

        return rewardObj;

    } catch (error) {
        console.log("getRewardDetailAndLimit error", error);
        return rewardObj;
    }

}

export const getTotalUserAndLimit = async (validateUserCount: boolean = false) => {
    let totalUserAndLimit = { totalUser: 0, totalUserLimit: 0 };
    try {

        const totalRegisterUser = await userDetailObject.totalUser();
        totalUserAndLimit.totalUser = totalRegisterUser.toNumber();
        const totalUserLimitResponse = await userDetailObject.maxUserLimit();
        totalUserAndLimit.totalUserLimit = totalUserLimitResponse.toNumber();

        return validateUserCount ? totalUserAndLimit.totalUser === totalUserAndLimit.totalUserLimit : totalUserAndLimit;

    } catch (error) {
        console.log("getTotalUserAndLimit error", error);
        return validateUserCount ? 9 : totalUserAndLimit;
    }

}

export const getReferralGenerateReward = async () => {

    try {

        const reward = await userDetailObject.rewardPointForReferralActivation();
        // console.log("getNumberFromWei(reward)", getNumberFromWei(reward))
        return getNumberFromWei(reward);

    } catch (error) {
        console.log("getReferralGenerateReward error", error)
        return 0;
    }

}

export const checkTransactionStatusByHash: any = async (transactionHash: string, internalCounter: number = 1) => {
    try {
        // console.log("transactionHash", transactionHash)
        if (transactionHash === '') {
            return 9;
        }
        // const receipt = await window.ethereum.request({ method: 'eth_getTransactionReceipt', params: [transactionHash] });
        const receipt: any = await rpcProvider.getTransactionReceipt(transactionHash);
        // console.log("receipt", receipt)
        if (receipt !== null && parseInt(receipt.status)) {
            return receipt;
        } else if (receipt !== null && !parseInt(receipt.status)) {
            return 9;
        } else if (receipt === null || TRN_STATUS_CHECK_INTERVAL >= internalCounter) {
            await delay(TRN_STATUS_CHECK_DELAY_SECONDS);
            return await checkTransactionStatusByHash(transactionHash, ++internalCounter);
        } else {
            return 9;
        }
    } catch (error) {
        console.log("error checkTransactionStatusByHash", error)
        return 9;
    }
}

export const getPoolLimit = async (userType: number) => {

    let limitObj = { limit: 0, maxLimit: 0 };
    try {

        if (userType === undefined || limitContractMethods[userType] === undefined) {
            return limitObj;
        }

        const limitValue = await userDetailObject[limitContractMethods[userType].limit]();
        limitObj.limit = getNumberFromWei(limitValue);

        const maxLimitValue = await userDetailObject[limitContractMethods[userType].maxLimit]();
        limitObj.maxLimit = maxLimitValue.toNumber();

        return limitObj;

    } catch (error) {
        console.log("getPoolLimit error", error);
        return limitObj;
    }

}

const convertUserDetailObject = async (userObject: any = {}) => {
    let userObj: any = Object.assign({}, userObject) as any;
    userObj.userType = userObject.userType.toNumber();
    userObj.lastRedemptionTime = userObject.lastRedemptionTime.toNumber();
    userObj.stakedAmount = getNumberFromWei(userObject.stakedAmount);
    return userObj;
}

const getNumberFromWei = (value: any) => {
    try {
        if (!value || value === '' || value.toString() === "0") {
            return 0;
        } else {
            const returnValue = ethers.utils.formatUnits(value.toString(), 18);
            return parseFloat(returnValue);
        }
    } catch (e) {
        console.log("error getNumberFromWei", e);
        return 0;
    }
}