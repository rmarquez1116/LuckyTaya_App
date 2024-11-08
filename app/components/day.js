import React from 'react'

function Day({ color, label, id, onSelect, data }) {
    return (
        <div onClick={() => onSelect(data,color)} key={id} className={`flex justify-center items-center rounded-[10px] w-9 h-9 align-middle ` + color}>{label}</div>
    )
}


export default Day