import React, { memo } from 'react'
import '../globals.css';
const Input = (props) => {

    return (
        <input className='bg-dark' {...props}></input>
    )
}

export default memo(Input)