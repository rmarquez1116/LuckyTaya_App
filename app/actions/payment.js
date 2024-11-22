'use server'
import axios from "axios"
import { sha256withRSAsign } from '../helpers/Crypto';
import { getToken } from "../helpers/StringGenerator";
import { formatDate } from "../lib/DataFilter";
import { saveData } from '../helpers/DB'
import { cookies } from "next/headers";

const starpay = process.env.BASE_URL_STARPAY
const Repayment = (req) => {
  const fee = req.fee;
  delete req.fee;
  const createRequest = (req) => {
    const mchId = process.env.STARPAY_MERCHANT_ID;
    const name = process.env.PAYMENT_NAME;
    const msgId = getToken(15);
    var date = new Date();
    var expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 2)

    const dates = {
      timeStart: formatDate(date.toISOString()),
      timeExpire: formatDate(expireDate.toISOString())

    }
    const request = {
      "msgId": msgId,
      "mchId": mchId,
      "notifyUrl": process.env.NOTIFY_URL,
      "deviceInfo": name,
      "currency": "PHP",
      "service": "pay.starpay.repayment",
      ...req, ...dates
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

  const saveTransaction = async (request) => {

    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');

    session = JSON.parse(session.value);
    const transaction = {
      request: request.request,
      status: "Created",
      accountNumber: session.accountNumber,
      transactionDate: new Date().toISOString(),
      fee: fee
    }

    saveData('qr_transactions', transaction)
  }

  try {


    const request = createRequest(req)
    console.log(request,'hello')
    const response = sendOrder(request)
    response.then(data => {
      return data;
    })
    saveTransaction(request)
    return response
  } catch (error) {
    return error
  }
}

export default Repayment