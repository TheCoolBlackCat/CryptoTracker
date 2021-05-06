import { ChangeEvent, useEffect, useState } from "react"

type VoidFunc = () => void
type FormChangeEvent = ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>
type FormChangeHandler = (e: FormChangeEvent) => void

type InputHook = [string, FormChangeHandler, VoidFunc]

/**
 * Hook for handling onChange in user input
 * @param  {string} initialVal The default initial state, defaults to ""
 * @param  {string} callback Optionally execute a function when input value changes
 * @return {InputHook}     The value, change handler, reset function array
 */
// eslint-disable-next-line
export default (initialVal = "", callback?: VoidFunc): InputHook => {
    const [value, setValue] = useState(initialVal)
    if (callback) {
        useEffect(() => callback())
    }
    const handleChange = (e: FormChangeEvent) => {
        e.preventDefault()
        setValue(e.currentTarget.value)
    }
    const reset = () => {
        setValue("")
    }
    return [value, handleChange, reset]
}

export type { InputHook }