import { fetchData, saveData } from '../../helpers/DB'
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
        amount: request.trxAmount
    }
    const transfer = await transferV2(transferRequest, session.token)
    const transaction = {
        ...request,
        ...transfer,
        status : "PENDING"
    }
    const save = await saveData('taya_cashout_request', transaction);
    
    return new Response(JSON.stringify({ code: 200, message: "success" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
