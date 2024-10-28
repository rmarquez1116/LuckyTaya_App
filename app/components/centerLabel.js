import React from 'react'

function CenterLabel({ label }) {
    return (
        <div className="grid grid-cols-1 grid-rows-1 gap-4 text-center">
            <div><label>{label}</label></div>
        </div>

    )
}

export default CenterLabel