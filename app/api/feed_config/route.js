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

    const data = (await fetchData('config', { "code": { $eq: "CFG0002" } }))[0]

    return new Response(JSON.stringify({ code: 200, message: "success", details: data }), { status: 200, headers: { 'Content-Type': 'application/json' } });

}
