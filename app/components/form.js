import React from 'react'
import Input from './input'
import { useFormStatus } from "react-dom";

export default function Form({ action, state, fields, buttonText }) {
    return (
        <form action={action} className="flex flex-col gap-3">
            {fields.map((object, i) => {
                return <React.Fragment key={`input-${i}`}>
                    <label  key={`label-${i}`} htmlFor={object.id}  className="text-left">{object.label}</label>
                    <Input key={`${object.id}-input`} type={object.type} name={object.id} id={object.id}></Input>
                    {state?.errors?.[object.id] && (
                        <p key={`${object.id}-error`} id={`${object.id}-error`}   className="text-red-500">{state.errors[object.id]}</p>
                    )}

                </React.Fragment>
            })}
            <SubmitButton/>
          </form>
    )

    function SubmitButton() {
        const { pending } = useFormStatus();
      
        return (
            <button disabled={pending}  className='primary' type="submit">{buttonText}</button>
        );
      }
}
