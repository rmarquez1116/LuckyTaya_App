import { fetchData } from "../helpers/DB";

export async function getCashInConvenienceFee() {
    const config = (await fetchData('config', { "code": { $eq: "CFG0001" } }))[0]
    return {
        convenienceStatic: config.cashInConFeeFixPlayer,
        conveniencePercentage: config.cashInConFeePercentage,
        type: config.cashInConFeeType
    }
}

export async function getCashOutConvenienceFee() {
    const config = (await fetchData('config', { "code": { $eq: "CFG0001" } }))[0]
    return {
        convenienceStatic: config.cashOutConFeeFixPlayer,
        conveniencePercentage: config.cashOutConFeePercentage,
        type: config.cashOutConFeeType
    }
}