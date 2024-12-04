
import MainLayout from "../layout/mainLayout";
import {  getFightSchedule } from "../actions/fight";
import ScheduleComponent from "./_component";

const currentDate = new Date();
export default async function Home() {
  const response = await getFightSchedule();
  const month =`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`

  return (
    <MainLayout>
     <ScheduleComponent currDate={month} data={response}/>
    </MainLayout>
  );
}
