import React from 'react'

function CenterLabel({ label }) {
    return (
        <div className="label-header1 grid grid-cols-1 grid-rows-1 gap-4 text-center uppercase">
            <div><label>{label}</label></div>
        </div>

    )
}

export default CenterLabel