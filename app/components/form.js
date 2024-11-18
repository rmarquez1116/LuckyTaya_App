import React from 'react'
import Input from './input'
import { useFormStatus } from "react-dom";
import Link from 'next/link';
import Select from 'react-select';

export default function Form({ action, state, fields, buttonText, hasBackButton = false }) {
    const renderElement = (object) => {
        if (object.type == "select") {
            const items = object.items.map((item) => { return { value: item.value, label: item.label } })
            return <React.Fragment>
                <input hidden value={object.value} name={object.id} />
                <Select onChange={(e) => object.onSelect(e)} placeholder={` Select ${object.label}`} options={items}
                    classNamePrefix="drop-down"
                    defaultValue={items.find(x => x.value == object.value)}
                />

            </React.Fragment>
        } else {
            return <React.Fragment>
                <Input key={`${object.id}-input`} type={object.type} name={object.id} id={object.id} defaultValue={object.value}></Input>


            </React.Fragment>
        }
    }

    return (
        <form action={action} className="flex flex-col gap-3">
            {fields.map((object, i) => {

                if (object.type == "separator")
                    return <div key={`label-${i}`} className='separator'>{object.label}</div>
                return <React.Fragment key={`input-${i}`}>
                    <label key={`label-${i}`} htmlFor={object.id} className="text-left">{object.label}</label>
                    {renderElement(object)}
                    {state?.errors?.[object.id] && (
                        <p key={`${object.id}-error`} id={`${object.id}-error`} className="text-red">{state.errors[object.id]}</p>
                    )}
                </React.Fragment>
            })}
            <SubmitButton />
        </form>
    )

    function SubmitButton() {
        const { pending } = useFormStatus();
        if (hasBackButton) {
            return (<div className="grid grid-cols-1 grid-rows-2 gap-1">
                <button disabled={pending} className='primary' type="submit">{buttonText}</button>
                <Link className="text-center underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href='/'>Back</Link>
            </div>
            )
        }
        return (
            <button disabled={pending} className='primary' type="submit">{buttonText}</button>
        );
    }
}
