'use server'
import { saveData } from "../helpers/DB";
import { cookies } from "next/headers";

export async function requestFund(request) {
    try {

        const cookieStore = await cookies()
        var session = cookieStore.get('app_session');
        const currentDate = new Date().toISOString();
        session = JSON.parse(session.value);
        request.accountNumber = session.accountNumber;
        request.userId = session.userId;
        request.date = currentDate;
        request.status = "Created"  
        await saveData('taya_request_fund', request)
        return true;

    } catch (error) {
        console.log(error, '----------')
    }
    return true;
}