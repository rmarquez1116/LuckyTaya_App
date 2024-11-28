import React, { memo } from 'react'
import '../globals.css';
const Input = (props) => {
    console.log(props,'hello')
    return (
        <input className='bg-dark' {...props}></input>
    )
}

export default memo(Input)