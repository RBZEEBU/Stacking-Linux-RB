export const mainTitle = "Zeebu Staking";
export const isProduction = false;

export const API_URL = "https://statistics.zeebu.com/";//"http://20.219.62.187:2006/";
export const WAITLIST_API_URL = isProduction ? "" : "https://webhookuat.zeebu.com/gov/"; //"http://20.219.62.187:9001/";

export const waitlistContractAddress = isProduction ? "" : "0xAdd7d2d79f269C040eAa7A6a233eAb44f32b4175"; // "0x69EA32f67ebe623339288cEb9276d1E6fA087928";
export const ZBUContractAddress = isProduction ? "" : "0x8b80b78a377e9D40c599b0E2542E474C4440ddd2"; // "0x88E1fF269D8DD9B4F4d6A3319605d7139E31D22e";

export const rpcName = isProduction ? "BSC Mainnet" : "Sepolia Network";
// export const rpcUrl = isProduction ? "https://bsc-dataseed.binance.org" : "https://data-seed-prebsc-1-s1.binance.org:8545";
export const rpcUrl = isProduction ? "" : "https://1rpc.io/sepolia";
export const rpcSymbol = isProduction ? "BNB" : "ETH";
export const rpcChainId = isProduction ? 56 : 11155111;
export const TRN_STATUS_CHECK_INTERVAL = 9;
export const TRN_STATUS_CHECK_DELAY_SECONDS = 10000;
export const tokenDecimalPlaces = isProduction ? 18 : 18;
export const stackDecimalPlaces = isProduction ? 18 : 18;
export const delay = (ms: any) => new Promise(res => setTimeout(res, ms));
export const minZBUBalance = 0;
export const minNativeCurrencyBalance = 0.005;
export const galxeRedirectLink = "https://app.galxe.com/quest/immmcZNfD7QrYWDLiB48B4/GCKV1thMEJ";
export const walletConnectProjectId = isProduction ? "02b70af6d1d755b9bd083d0c1716b9a4" : "856f6a1a2894fcd8242ba3532343e62e";
export const explorerUrl = isProduction ? "" : "https://sepolia.etherscan.io/";
export const limitContractMethods = [{ limit: "OLPPoolStatus", maxLimit: "OLPPoolLimit" }, { limit: "DeployerPoolStatus", maxLimit: "DeployerPoolLimit" }];
export const apiUrls: { [key: string]: string } = {
    "getInvoiceStatistic": API_URL + "api/GetInvoiceStatisticsForUser?type=",
    "getZeebuRate": API_URL + 'ZeebuGetRate',
    "getTotalMerchant": API_URL + "api/getSignupUserCounts",
    "getPaymentList": API_URL + "api/ListInvoicePaymentData",
    "getRewardList": API_URL + "api/ListRewardsHistory",
    "getZBUBurnedList": API_URL + "api/ListBurningHistory",
    "getRateChartData": API_URL + "api/mexcChartAPI",
    "getMerchantKYCDetail": API_URL + "api/ListUserKYCRequestV2",
    "getMarketData": API_URL + "api/marketData",
    "getNFTMappingData": API_URL + "api/GetNFTMappingReportCount",
    "getWaitlistStatistic": API_URL + "api/getWaitlistStatistics?timePeriod=",
    "getTopRewardGainer": WAITLIST_API_URL + "api/getTopRewardGainerV1",
    "getRecentRegistrationList": WAITLIST_API_URL + "api/getRecentRegisteredUserList",
    "getFAQList": WAITLIST_API_URL + "api/getFAQRequest",
}
export const topRecordsInTable = 5;
export const zbuBurningAddress = "0xC2855eAc217a5E989FCeEDE93e453bd555FE720e";
export const staticToken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlwIjoiMTI3LjAuMC4xIiwiZGV2aWNlSW5mbyI6InVuZGVmaW5lZF91bmRlZmluZWR8dW5kZWZpbmVkX3VuZGVmaW5lZHx1bmRlZmluZWQiLCJwcm92aWRlcklkIjoxLCJzaXRlQWNjZXNzVG9rZW4iOiJhMTVmMzhjOS1mY2UxLTQyODktYmEyOC04ZDQxNjM5N2ZmOTkiLCJzaXRlbmFtZSI6IlpFRUJVIn0sImlhdCI6MTcxNTE2NzUxM30.VtWlePseTf1O26yVPsUdbTTCcPsYBRcG_a4c2t4mE1FuZZpTA2Unu6DhWq_3vCsByx0310S_pSsAFr2B8iJFg_Hxup5Qu7-twNcASm7pRWGzP7fMmmYGzvbGpbUGPaVjRiCAsfU5tG4Y52FAtJyMBMZEMUfdEwDN5AWS1yk93hkXNA5dZftynDeAm-Lvjynmu4PGS_z3R9KeAi67vkg2NlL3KsGeGPWWOKwMNe8wJCKq_F3mmideYkXdPjytK1l5te8oOdBr6aFfZFw_Pr4vK--PPT5wlOSvDo9Fu8r4bIsS-7MrmGt1Q476FrAkB0Bk8g__MujUqt_VWw55bD-0pVHs4r3SZwqgolY7Wty7lm6EFIzGw9JrrcVYCjdl8VBFVKh7EBs10VeGwdX9pZC36QUyrllQazBL3q1RXjA2ezk-MU34Pnmkvx2V7tYFHEpGQz2Wc4WhYpnogD1AxGcFvHXcOfMyEc1fIr2C1Ku-xkfc7C0u-rhoftsnEkjiCBEqPisYjfX0Y7Y1GmsnEB_bru_PS9VgugVOGel4A1_chSnjrpxl7jOitncpwfNcelkE52JEAGjuDHY-tAg7QU1HQKgH-e2aPixjq7PZstgSj4sQhmFYWHT84rn6M4Bm6-ubg0gWriip5--kx3Wbjwcq9hZYvRu8u0pHgoxnjXqOu0I";