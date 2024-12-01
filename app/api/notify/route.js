import { insertDecimalAtThirdToLast } from '../../helpers/Common';
import { sha256withRSAverify } from '../../helpers/Crypto'
import { fetchData, saveData, updateData } from '../../helpers/DB'
import { transferV2 } from '../../actions/transaction'
import { Agent } from 'https';
import axios from 'axios';
export async function POST(req) {
    const request = await req.json();  // Parse the incoming JSON body
    const query = { "request.msgId": { $eq: request.request.originalMsgId } }
    const data = await fetchData('qr_transactions', query)
    const result = sha256withRSAverify(JSON.stringify(request.request), request.signature)
    await saveData('taya_sp_request',request)
    if (!result)
        return new Response(JSON.stringify({ code: "401", message: "Unauthorized" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    if (!data) {
        return new Response(JSON.stringify({ code: "500", message: "Transaction Not found" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
        const newData = data[0];
        if (newData.response || newData.status == 'Completed') {

            return new Response(JSON.stringify({ code: "200", message: "Transaction already processed" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
            // processing 
            const config = (await fetchData('config', { "code": { $eq: "CFG0001" } }))[0]
            const token = await getToken(config.masterUsername, config.masterPassword)

            
            // transfer to convenience fee
            // var transferConFee = {
            //     accountNumber: config.convenienceAccountNumber,
            //     amount: newData.fee
            // }
            // const transferFee = await transferV2(transferConFee, token)
            // newData.masterToFee = transferFee;

            // first Leg
            // get Fee in trxAmount
            var amountBeforeFee = insertDecimalAtThirdToLast(newData.request.trxAmount)
            // amountBeforeFee = parseFloat(amountBeforeFee) - newData.fee;
            var transferRequest = {
                accountNumber: newData.accountNumber,
                amount: amountBeforeFee
            }
            const transfer = await transferV2(transferRequest, token)
            newData.masterToPlayer = transfer


            newData.response = request.request;
            newData.status = "Completed";
            newData.transType = "cashin"
            const updateResult = await updateData('qr_transactions', query, newData);
        }
    }
    return new Response(JSON.stringify({ code: 200, message: "success" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}


const getFee = (config) => {
    if (config) {
        if (config.type == 1) {
            return config.convenienceStatic
        } else {
            return config.conveniencePercentage
        }
    }
}

async function getToken(username, password) {

    const request = { username, password };
    const httpsAgent = new Agent({
        rejectUnauthorized: false
    })
    try {
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/User/Login`, request, {

            headers: {
                "Content-Type": "application/json",
            }
            , httpsAgent
        })
        if (response.status == 200) {
            return response.data.token
        }
    } catch (error) {

        console.log(error, 'error')
        return null
    }

}

