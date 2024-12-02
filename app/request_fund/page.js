
import React  from "react";
import MainLayout from "../layout/mainLayout";
import BalanceHeader from '../components/balanceHeader'
import { getCashInConvenienceFee } from '../lib/config'
import RequestFund from './_component';

export default async function RequestFundPage() {

  return (
    <MainLayout>
      <React.Fragment>

        <RequestFund />
      </React.Fragment>
    </MainLayout >
  );
}