'use client'
import React, { useEffect, useState } from "react";
import TransactionItem from "../components/transactionItem";
import MainLayout from "../layout/mainLayout";
import BalanceHeader from "../components/balanceHeader";
import { getTransactionsByDate } from "../actions/transaction";
import Loading from "../components/loading";

export default function TransactionHistory() {

  const [transactionList, setTransactionList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getTransactionsByDate()
        setTransactionList(result)
        setIsLoaded(true)
      } catch (error) {   
      }
    }
    getData();
    return () => {

    }
  }, [])

  return (
    <MainLayout>
      <BalanceHeader type={2} />
      <div className="w-full flex flex-col gap-10 p-6">

        <label className="text-center label-header1">Transaction History</label>
        <div className="grid grid-cols-1 gap-4 place-items-center">
          {isLoaded && transactionList.map((data, i) => {
            return <React.Fragment key={`transaction-${i}`}>
              <TransactionItem data={data} />
            </React.Fragment>
          })}
          {!isLoaded && <Loading/>}
        </div>
      </div>

    </MainLayout >
  );
}
