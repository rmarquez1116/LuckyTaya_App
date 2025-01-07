'use client'
import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/mainLayout";
import BalanceHeader from "../../components/balanceHeader";
import Loading from "../../components/loading";
import Tables from "../../components/tables";
import ConfirmationModal from "@components/confirmationModal"
import { format } from 'date-fns'
import { formatAccountNumber, getStartOfWeek } from "../../lib/utils";
import { formatMoney, formatMoneyV2 } from "../../helpers/Common";
import axios from "axios";

export default function RequestFund() {
  const currDate = new Date()

  const [requests, setRequests] = useState([])
  const [filterRequests, setFilterRequests] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const [alert, setAlert] = useState({
    isShow: false,
    message: "Are you sure you want to proceed with the payment?",
    isOkayOnly: false
  })

  const [alertResponse, setAlertResponse] = useState({
    isShow: false,
    message: "Transaction Successful",
    isOkayOnly: true
  })

  const getData = async () => {
    try {
      const response = await axios.get('/api/request_fund_list',)
      const responseData = response.data
      setRequests(responseData.details)
      setFilterRequests(responseData.details)
      setIsLoaded(true);
    } catch (ex) {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    getData();
    return () => {
    }
  }, [])

  const onPay = (item) => {
    setCurrentItem(item);
    setAlert(e => ({
      ...e,
      isShow: true
    }))
  }
  const onCancel = () => {
    setCurrentItem({});
    setAlert(e => ({
      ...e,
      isShow: false
    }))
  }

  const onConfirm = async () => {
    let message = "Transaction successfully processed."
    try {
      setIsLoading(true);
      const response = await axios.post('/api/fund_payment', currentItem)
      setFilterRequests(requests)
    } catch (ex) {
      message = "Can't process your request. Please try again later."
    } finally {
      setAlert(e => ({
        ...e,
        isShow: false
      }))
      setAlertResponse(e => ({
        ...e,
        message: message,
        isShow: true
      }))
      setIsLoading(false);
    }
  }
  const onAlertResponseConfirm = () => {
    setAlertResponse(e => ({
      ...e,
      isShow: false
    }))
  }
  
  const getStatusLabel = (item) => {
    let result = "Pending";
    if (item.status == "Created") return "Pending"
    if (item.status == "Approved" && item.isPaid) return "Paid"
    return item.status
  }

  return (
    <MainLayout>
      <BalanceHeader type={2} forceUpdate={isLoading} />
      <div className="w-full flex flex-col gap-10 p-6">
        <ConfirmationModal
          isOpen={alert.isShow}
          isOkOnly={alert.isOkayOnly}
          onConfirm={onConfirm}
          onCancel={onCancel}
          message={alert.message}
        ></ConfirmationModal>
        <ConfirmationModal
          isOpen={alertResponse.isShow}
          isOkOnly={alertResponse.isOkayOnly}
          onConfirm={onAlertResponseConfirm}
          message={alertResponse.message}
        ></ConfirmationModal>
        <label className="text-center label-header1">Request Fund List</label>
        <div className="grid grid-cols-1 gap-4 place-items-center">

          {isLoaded && <div className="overflow-x-auto max-w-full">
            <Tables
              primaryId="date"
              headers={[
                {
                  key: 'date',
                  label: 'Date',
                  format: (val) => {
                    const formatDate = new Date(val)
                    return format(formatDate, 'yyyy-MM-dd hh:mm:ss a')
                  }
                }, {
                  key: 'amount',
                  label: 'Amount',
                  customValueClass: 'text-semiYellow',
                  format: (val) => {
                    return formatMoneyV2(val)
                  }
                },
                {
                  key: '',
                  label: 'Status',
                  customValue: (val) =>
                    <div>
                      {getStatusLabel(val)}
                    </div>

                },
                {
                  key: '',
                  label: 'Action',
                  customValue: (item) => <div className="flex gap-2 items-center justify-center">
                    {item.status == "Approved" && (!item.isPaid) && <button className="primary"
                      onClick={() => onPay(item)}
                      disabled={!isLoaded}
                      type={'button'}>Pay
                    </button>}
                  </div>
                }
              ]}
              items={filterRequests}
              isCentered={true}
            />
          </div>}
          {!isLoaded && <Loading />}
          {isLoading && <Loading />}

        </div>
      </div>

    </MainLayout >
  );
}
