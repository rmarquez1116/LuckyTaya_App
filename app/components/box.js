import React from 'react'

function Box({ color,label }) {
    return (
        <div className={`small-box ` + color}>{label}</div>
    )
}


export default Box