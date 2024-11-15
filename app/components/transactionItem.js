import React from 'react'

function TransactionItem({ data, key }) {
    const date = new Date(data.transactionDateTime ?? data.transactionDate)
    const getAmount = () => {
        if (data.transactionType && data.transactionType == "Fee") {
            return `-${data.amount}`
        }
        if (data.transCategoryDesc && data.transCategoryDesc == "Out") {
            return `-${data.amount}`
        }
        return data.amount
    }

    return (<div key={`div-${key}`} className='card p-8  rounded-[20px] shadow max-w-md w-full'>
        <div key={`div1-${key}`} className='grid grid-cols-1 grid-rows-5 gap-1'>
            <label key={`label1-${key}`} className=' text-[16px] text-right font-bold'>{getAmount()}</label>
            <label key={`label2-${key}`} className=' text-[16px]'>
                Trans Type: <span className='font-bold'>
                    {data.transactionType && !Number.isInteger(data.transactionType)
                        ? data.transactionType : data.transactionDesc}
                </span>
            </label>
            <label key={`label3-${key}`} className=' text-[16px]'>
                Amount: <span className='font-bold'>
                    {getAmount()}
                </span>
            </label>
            <label key={`label4-${key}`} className=' text-[16px]'>
                Date: <span className='font-bold'>
                    {date.toLocaleDateString()}
                </span>

            </label>
            <label key={`label5-${key}`} className=' text-[16px]'>
                Time: <span className='font-bold'>
                    {date.toLocaleTimeString()}
                </span>
            </label>
            <label key={`label6-${key}`} className=' text-[16px]'>
                Trans ID: <span className='font-bold'>
                    {data.transactionNumberStr}
                </span>
            </label>

        </div>
    </div >
    )
}

export default TransactionItem