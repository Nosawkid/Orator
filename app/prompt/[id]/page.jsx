"use client"
import { deleteScript } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import gsap from "gsap";
import { StepBack } from "lucide-react";
import { Pause, Play, TextAlignCenter, TextAlignStart } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PromptPage() {
    const {id} = useParams()
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLeftAligned, setIsLeftAligned] = useState(false)
    const [speed,setSpeed] = useState(1)
    const [fontSize,setFontSize] = useState(30)
    const [margin,setMargin] = useState(0)
    const [script,setScript] = useState("")
    const textRef = useRef(null)
    const animationRef = useRef(null)

    const handleReverse = () => {
    if (!animationRef.current) return;

    // Reverse the animation from its current position
    animationRef.current.reverse();

    // If it was paused, start playing
    if (!isPlaying) {
        animationRef.current.play();
        setIsPlaying(true);
    }
};


    

    const handlePlay = () => {
  if (!animationRef.current) {
    // create the animation only once
    const textHeight = textRef.current.offsetHeight;

    animationRef.current = gsap.to(textRef.current, {
      y: `-=${textHeight}`, // move text up by its own height
      duration: 60,         // adjust scroll speed
      ease: "linear",
      paused: true,         // start paused
    });
  }

  

  if (!isPlaying) {
    animationRef.current.play(); // resume or start
  } else {
    animationRef.current.pause(); // pause at current position
  }

  setIsPlaying((p) => !p);
};




    const handleAlignment = () => {
        
        setIsLeftAligned((alignment) => !alignment)
    }

   


    useEffect(()=>{
        if (!id) return

  async function fetchScript() {
    try {
      const res = await fetch(`/api/scripts/${id}`)
      if (!res.ok) throw new Error("Failed to fetch script")
      const data = await res.json()
      setScript(data.content)
    } catch (err) {
      console.error(err)
    }
  }

  fetchScript()
    },[])

    const handleDelete = async()=>{
      await deleteScript(id)
      redirect("/")
    }
    

    return (
        <section className="bg-black w-full min-h-screen">
            <div className="flex items-center justify-center gap-4 text-white px-6 py-6 text-2xl border-b border-gray-300 ">
                <Button onClick={handleDelete}>Go Back</Button>
                {isPlaying ? <Pause onClick={handlePlay} /> : <Play onClick={handlePlay} />}
                {isPlaying && <StepBack onClick={handleReverse} />}
                {isLeftAligned ? <TextAlignCenter onClick={handleAlignment} /> : <TextAlignStart onClick={handleAlignment} />}

                <div className="flex items-center gap-3">
                    <div><Label>Text Size {fontSize}</Label>
                        <Input value={fontSize} onChange={(e)=>setFontSize(e.target.value)} type={"range"} min={30} max={180} /></div>
                    <div>
                        <Label>Margin {margin}</Label>
                        <Input value={margin} onChange={(e)=>setMargin(e.target.value)} type={"range"} max={40} />
                    </div>
                    <div>
                        <Label>Speed {speed / 10}</Label>
                        <Input onChange={(e)=>{
                            const newSpeed = e.target.value
                            setSpeed(newSpeed)
                            if(animationRef.current)
                            {
                                animationRef.current.timeScale(newSpeed/10)
                            }
                        }} min={1} max={50} value={speed} type={"range"}  />

                    </div>
                </div>
            </div>
            <div style={{margin:`${margin}px`}}  className="mt-2 px-5 relative overflow-hidden">
                <p ref={textRef} style={{fontSize:`${fontSize}px`,textAlign: isLeftAligned ? "start":"center",whiteSpace:"pre-wrap"}} className="text-white font-bold" id="text">{script}</p>
            </div>
        </section>
    )
}