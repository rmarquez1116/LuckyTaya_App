"use server";
import { fetchData } from '../helpers/DB'

export async function regions() {
    try {
        const region = await fetchData('taya_regions', {})
        return region;
        
    } catch (error) {
        return []
    }
}

export async function provinces(regionCode) {
    try {
       const province = await fetchData('taya_provinces', { 'regCode': { $eq: regionCode } })
       return province
    
   } catch (error) {
    return []
   }
}


export async function cities(provinceCode) {
    try {
        const city = await fetchData('taya_cities', { 'provCode': { $eq: provinceCode } })
        return city
        
    } catch (error) {
        return []
    }
}

export async function barangays(cityCode) {
    try {
        const barangay = await fetchData('taya_barangays', { 'citymunCode': { $eq: cityCode } })
        return barangay
        
    } catch (error) {
        return []
    }
}
