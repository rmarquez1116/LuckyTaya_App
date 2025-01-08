import { fetchData, saveData } from '../../helpers/DB'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
export async function GET(req) {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    session = JSON.parse(session.value);

    const data = (await fetchData('taya_request_fund', { "userId": { $eq: session.userId } }))

    return new Response(JSON.stringify({ code: 200, message: "success", details: data }), { status: 200, headers: { 'Content-Type': 'application/json' } });

}
