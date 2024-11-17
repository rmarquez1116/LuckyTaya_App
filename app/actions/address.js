"use server";
import { fetchData } from '../helpers/DB'

export async function regions() {
    const region = await fetchData('taya_regions', {})
    return region;
}

export async function provinces(regionCode) {
    const province = await fetchData('taya_provinces', { 'regCode': { $eq: regionCode } })
    return province
}


export async function cities(provinceCode) {
    const city = await fetchData('taya_cities', { 'provCode': { $eq: provinceCode } })
    return city
}

export async function barangays(cityCode) {
    const barangay = await fetchData('taya_barangays', { 'citymunCode': { $eq: cityCode } })
    return barangay
}
