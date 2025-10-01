"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import { generateScript, saveScript } from '../actions'
import { LineSpinner } from 'ldrs/react'
import 'ldrs/react/LineSpinner.css'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Default values shown



const Home = () => {
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const handleGenerateScript = async () => {
    if (!aiPrompt) return
    setIsGenerating(true)
    try {
      const result = await generateScript(aiPrompt)
      if (result.error) {
        console.error(result.error)
      } else {
        setScript(result.script)
        setCharCount(result.script.length)
        setIsDialogOpen(false) // Close the dialog on success
        setAiPrompt("")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsGenerating(false)
    }
  }





  return (
    <main className='px-6 py-3'>
      <h1 className='text-center text-5xl font-bold'>The <span className='text-green-700'>Teleprompter</span> That Works With You</h1>
      <p className='font-medium text-lg my-5 max-w-lg mx-auto text-center'>A modern, free teleprompter designed to make your speeches effortless. With smooth scrolling, clean design, and intuitive controls, it helps you focus on delivering your words, not managing your script.</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>


        {/* <Dialog>
          <DialogTrigger>
            <p className='cursor-pointer text-green-700'>Use our smart<span className='hover:underline'>AI</span> to generate your scripts</p>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle></DialogTitle>
            <Label htmlFor="script">Tell Us your Script Idea...</Label>
            <Textarea className={"h-[200px]"} placeholder="Scribble Here" />
            <Button>Submit</Button>
          </DialogContent>
        </Dialog> */}

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <p className='cursor-pointer text-green-700 w-fit'>Use our smart<span className='hover:underline'> AI </span>to generate your scripts</p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate a script with AI</DialogTitle>
            </DialogHeader>
            <Label htmlFor="ai-prompt">Tell us your script idea...</Label>
            <Textarea
              id="ai-prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className={"h-[200px]"}
              placeholder="e.g., a 1-minute YouTube short about the benefits of reading"
            />
            {/* Set type="button" to prevent it from submitting the outer form */}
            <Button onClick={handleGenerateScript} disabled={isGenerating} type="button">
              {isGenerating ? <LineSpinner size="20" stroke="3" speed="1" color="white" /> : "Generate Script"}
            </Button>
          </DialogContent>
        </Dialog>












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