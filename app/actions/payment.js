'use server'
import axios from "axios"
import { sha256withRSAsign } from '../helpers/Crypto';
import { getToken } from "../helpers/StringGenerator";

const starpay = process.env.NEXT_PUBLIC_BASE_URL_STARPAY
const Repayment = (req) => {


  const createRequest = (req) => {
    const mchId = process.env.NEXT_PUBLIC_STARPAY_MERCHANT_ID;
    const name = process.env.NEXT_PUBLIC_PAYMENT_NAME;

    const request = {
      "msgId": getToken(15),
      "mchId": mchId,
      "notifyUrl": `https://localhost:8080/api/transaction/complete/order`,
      "deviceInfo": name,
      "currency": "PHP",
      "service": "pay.starpay.repayment",
      ...req
    }
    
    const signature = sha256withRSAsign(JSON.stringify(request))
    const data = {
      request: request,
      signature: signature
    }
    return data;
  }

  const sendOrder = (request) => {
    const instance = axios.create({ baseURL: starpay })

    let api = '/v1/repayment'
    const response = instance.post(api, request)
      .then(response => {
        return response.data
      })
      return response
  }

  try {


    const request = createRequest(req)
    console.log(request, 'hello1235')
    const response = sendOrder(request)
    response.then(data => {
      return data
    })
    return response
  } catch (error) {
    return error
  }
}
export default Repayment