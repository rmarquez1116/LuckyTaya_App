'use client'
import TransactionItem from "../components/transactionItem";
import MainLayout from "../layout/mainLayout";
import BalanceHeader from "../components/balanceHeader";
import React, { useEffect, useState } from "react";
import { getTransactionsByDate } from "../actions/transaction";

const transactions = [
  {
    transactionDesc: "Debit",
    amount: "1,000",
    transactionDateTime : '2024-10-27T05:57:12.207Z',
    transactionNumberStr: '123456789'
  },
  {
    transactionDesc: "Debit",
    amount: "1,000",
    transactionDateTime : '2024-10-27T05:57:12.207Z',
    transactionNumberStr: '123456789'
  },
  {
    transactionDesc: "Debit",
    amount: "1,000",
    transactionDateTime : '2024-10-27T05:57:12.207Z',
    transactionNumberStr: '123456789'
  },
  {
    transactionDesc: "Debit",
    amount: "1,000",
    transactionDateTime : '2024-10-27T05:57:12.207Z',
    transactionNumberStr: '123456789'
  },
  {
    transactionDesc: "Debit",
    amount: "1,000",
    transactionDateTime : '2024-10-27T05:57:12.207Z',
    transactionNumberStr: '123456789'
  },
]
export default function TransactionHistory() {

  const [transactionList, setTransactionList] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1).toISOString();
        var lastDay = new Date(y, m + 1, 0).toISOString();
        const result = await getTransactionsByDate(firstDay, lastDay)
        setTransactionList(result)
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

        <label className="text-center">Transaction History</label>
        <div className="grid grid-cols-1 gap-4 place-items-center">
          {transactionList.map((data, i) => {
            return <React.Fragment key={`transaction-${i}`}>
              <TransactionItem data={data} />
            </React.Fragment>
          })}
        </div>
      </div>

    </MainLayout >
  );
}
