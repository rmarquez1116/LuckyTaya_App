import MainLayout from "../layout/mainLayout";
import CashoutComponent from './_component';
import banks from '../actions/banks'
import { getCashOutConvenienceFee } from "../lib/config";
export default async function CashOut() {
  const bank = await banks()
  console.log(bank, '===========')
  const conf = await getCashOutConvenienceFee()

  const starpayReceivingBanks = [
    {
      "swiftCode": "APHIPHM2XXX",
      "bankName": "Alipay / Lazada Wallet",
      "bankCode": "7021",
      "maintenanceStartTime": "Jun 6, 4:20 PM",
      "maintenanceEndTime": "Jun 6, 4:50 PM",
      "underMaintenance": "false"
    },
    {
      "swiftCode": "OPDVPHM1XXX",
      "bankName": "AllBank (A Thrift Bank), Inc.",
      "bankCode": "0210",
      "maintenanceStartTime": "Aug 24, 1:00 AM",
      "maintenanceEndTime": "Aug 24, 11:20 AM",
      "underMaintenance": "false"
    }
  ];
  return (
    <MainLayout>
      <CashoutComponent banks={starpayReceivingBanks} config={conf} />
    </MainLayout >
  );
}