import React from 'react'

function TransactionItem({ data, key }) {
    const date = new Date(data.transactionDateTime)

    return (<div  key={`div-${key}`} className='card p-8  rounded-[20px] shadow max-w-md w-full'>
        <div  key={`div1-${key}`} className='grid grid-cols-1 grid-rows-5 gap-1'>
            <label  key={`label1-${key}`} className='text-right'>{data.amount}</label>
            <label  key={`label2-${key}`} className=''>Trans Type: {data.transactionDesc}</label>
            <label  key={`label3-${key}`} className=''>Amount: {data.amount}</label>
            <label  key={`label4-${key}`} className=''>Date: {date.toLocaleDateString()}</label>
            <label  key={`label5-${key}`} className=''>Time: {date.toLocaleTimeString()}</label>
            <label  key={`label6-${key}`} className=''>Trans ID: {data.transactionNumberStr}</label>

        </div>
    </div>
    )
}

export default TransactionItem