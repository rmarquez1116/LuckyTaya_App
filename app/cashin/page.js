
import React  from "react";
import MainLayout from "../layout/mainLayout";
import BalanceHeader from '../components/balanceHeader'
import { getCashInConvenienceFee } from '../lib/config'
import CashIn from './_component';

export default async function CashInPage() {
  const conf = await getCashInConvenienceFee()

  return (
    <MainLayout>
      <React.Fragment>

        <CashIn config={conf} />
      </React.Fragment>
    </MainLayout >
  );
}