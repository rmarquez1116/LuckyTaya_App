import React from 'react'

function Day({ color,label,key }) {
    return (
        <div key={key} className={`flex justify-center items-center rounded-[10px] w-9 h-9 align-middle ` + color}>{label}</div>
    )
}


export default Day