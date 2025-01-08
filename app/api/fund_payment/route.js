import { fetchData, updateData } from '../../helpers/DB'
import { transferV2 } from '../../actions/transaction'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
export async function POST(req) {
    const request = await req.json();  // Parse the incoming JSON body

    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    session = JSON.parse(session.value);

    // processing 
    const config = (await fetchData('config', { "code": { $eq: "CFG0001" } }))[0]

    var transferRequest = {
        accountNumber: config.mainAgentAccount,
        amount: Number.parseFloat(request.amount)
    }
    const transfer = await transferV2(transferRequest, session.token)
    if (transfer == null) {
        return new Response(JSON.stringify({ code: "500", message: "Can not process your request. Please check your balance" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const criteria = {
        "userId": { $eq: session.userId },
        "amount": { $eq: request.amount },
        "date": { $eq: request.date },
    };
    const fundRequest = (await fetchData('taya_request_fund', criteria))[0]

    if (fundRequest) {
        fundRequest.isPaid = true
        await updateData('taya_request_fund',
            criteria, fundRequest);
    } else {
    }

    return new Response(JSON.stringify({ code: 200, message: "success" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
