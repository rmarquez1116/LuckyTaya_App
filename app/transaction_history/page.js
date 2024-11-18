'use client'
import React, { useEffect, useState } from "react";
import MainLayout from "../layout/mainLayout";
import BalanceHeader from "../components/balanceHeader";
import { getTransactionsByDate } from "../actions/transaction";
import Loading from "../components/loading";
import Tables from "../components/tables";
import { format } from 'date-fns'
import { getStartOfWeek } from "../lib/utils";
import { formatMoney, formatMoneyV2 } from "../helpers/Common";

export default function TransactionHistory() {
  const currDate = new Date()
  const defaultEndDate = new Date(currDate)
  defaultEndDate.setHours(23, 59, 59, 999)

  const [startDate, setStartDate] = useState(format(getStartOfWeek(new Date(currDate.getTime() - 14 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(defaultEndDate, 'yyyy-MM-dd'))

  const [transactionList, setTransactionList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  const getData = async () => {
    try {
      const startDateDateTime = new Date(startDate)
      startDateDateTime.setHours(0, 0, 0, 0);

      const endDateDateTime = new Date(endDate)
      endDateDateTime.setHours(23, 59, 59, 999);

      const result = await getTransactionsByDate({
        dateFrom: startDateDateTime.toISOString(),
        dateTo: endDateDateTime.toISOString(),
        isBettingHistory: false
      })
      setTransactionList(result)
      setIsLoaded(true)
    } catch (error) {
    }
  }

  useEffect(() => {

    getData();
    return () => {
    }
  }, [])

  const onHandleSubmit = async () => {
    setIsLoaded(false)
    if (!startDate) {
      setStartDate(format(getStartOfWeek(currDate), 'yyyy-MM-dd'))
    }
    if (!endDate) {
      setEndDate(format(defaultEndDate, 'yyyy-MM-dd'))
    }
    await getData()
    setIsLoaded(true)
  }


  return (
    <MainLayout>
      <BalanceHeader type={2} />
      <div className="w-full flex flex-col gap-10 p-6">

        <label className="text-center label-header1">Transaction History</label>
        <div className="grid grid-cols-1 gap-4 place-items-center">
          <div className="flex flex-row">
            <div className="gap-2 flex">
              <input name="startDate" label="Start Date" placeholder="Enter Load To" value={startDate} onChange={(e) => {
                setStartDate(e.target.value)
              }} type="date" />
              <input name="endDate" label="End Date" placeholder="Enter Load To" value={endDate} onChange={(e) => {
                setEndDate(e.target.value)
              }} type="date" />

              <button className="primary" onClick={onHandleSubmit} disabled={!isLoaded} type={'button'}>Search</button>
            </div>
          </div>
          {isLoaded && <div className="overflow-x-auto max-w-full">
            <Tables
              primaryId="id"
              headers={[
                {
                  key: 'transactionDateTime',
                  label: 'DATE',
                  format: (val) => {
                    const formatDate = new Date(val)
                    return format(formatDate, 'yyyy-MM-dd hh:mm:ss a')
                  }
                }, {
                  key: 'transactionNumber',
                  label: 'TXN ID'
                }, {
                  key: 'fromFullName',
                  concatKey: ['fromAccountNumber'],
                  concatSeparator: ' | ',
                  label: 'SENDER'
                }, {
                  key: 'toFullName',
                  concatKey: ['toAccountNumber'],
                  concatSeparator: ' | ',
                  label: 'RECEIVER'
                }, {
                  key: 'amount',
                  label: 'AMOUNT',
                  customValueClass: 'text-semiYellow',
                  format: (val) => {
                    return formatMoneyV2(val)
                  }
                }, {
                  key: 'transactionDesc',
                  concatKey: ['transCategoryDesc'],
                  concatSeparator: ' ',
                  label: 'TYPE'
                },
              ]}
              items={transactionList}
              isCentered={true}
            />
          </div>}
          {!isLoaded && <Loading />}
        </div>
      </div>

    </MainLayout >
  );
}
