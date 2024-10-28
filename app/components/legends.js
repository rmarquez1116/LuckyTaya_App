import React from 'react'
import Box from './box'

function Legends() {
    return (
        <>
            <div className="inline-flex gap-2 align-middle"><Box color="finish" />Finish Event</div>
            <div className="inline-flex gap-2 align-middle"><Box color="current" />Current Event</div>
            <div className="inline-flex gap-2 align-middle"><Box color="schedule" />Schedule Event</div>
            <div className="inline-flex gap-2 align-middle"><Box color="default" />No Event</div>

        </>
    )
}

export default Legends