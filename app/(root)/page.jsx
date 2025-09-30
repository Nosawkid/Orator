"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import { saveScript } from '../actions'
import { LineSpinner } from 'ldrs/react'
import 'ldrs/react/LineSpinner.css'

// Default values shown



const Home = () => {
  const [script, setScript] = useState("")
  const [pending, setPending] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPending(true)
    const formData = new FormData()
    formData.append("script", script)
    try {
      await saveScript(formData)
      setScript("")
      setCharCount(0)
    } catch (err) {
      console.log(err)
    } finally {
      setPending(false)
    }
  }





  return (
    <main className='px-6 py-3'>
      <h1 className='text-center text-5xl font-bold'>The <span className='text-green-700'>Teleprompter</span> That Works With You</h1>
      <p className='font-medium text-lg my-5 max-w-lg mx-auto text-center'>A modern, free teleprompter designed to make your speeches effortless. With smooth scrolling, clean design, and intuitive controls, it helps you focus on delivering your words, not managing your script.</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <Label className={"text-lg font-bold "} htmlFor="script">Light up your script</Label>
        <Textarea name="script" value={script} onChange={(e) => {
          let value = e.target.value

          setScript(value)
          setCharCount(value.length)
        }} className={"h-[300px]"} id="script" />
        <span>Character Count: {charCount}</span>
        <Button className={"bg-green-700"}>{pending ? <LineSpinner
          size="20"
          stroke="3"
          speed="1"
          color="white"
        />
          : "Start the Cue"}</Button>
      </form>
    </main>
  )
}

export default Home