"use server"


import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { prisma } from "./utils/db"
import { redirect } from "next/navigation"

import { GoogleGenerativeAI } from "@google/generative-ai"



export async function saveScript(formData) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) throw new Error("Unauthorized")

  const content = formData.get("script")

  const savedScript = await prisma.Script.create({
    data: {
      content,
      kindeId: user?.id,
    },
  })


  redirect(`/prompt/${savedScript?.id}`)
}


export async function deleteScript(id)
{
  try {
    const deletedRecord = await prisma.Script.delete({
      where:{
        id:id
      }
    })
  } catch (error) {
    console.log("Error on deletion")
    console.log(error)
  }
}



export async function subscribeUser(kindeId) {
  const subscription = await prisma.userSubscription.update({
    where: { kindeId },
    data: { isPremium: true },
  });

  return subscription;
}


export async function generateScript(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" })
  const fullPrompt = `You are a scriptwriting assistant. Based on the following idea, generate a long, compelling script suitable for a teleprompter. The idea is: "${prompt}". Keep it detailed and impactful. Format all stage cues in ALL CAPS within square brackets, like [PAUSE], [LOOK AT CAMERA], [SHIFT TONE].`;

  try
  {
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    return {script:text}
  } catch(err)
  {
    console.error("Error generating script:", err);
    // Return an error object
    return { error: "Failed to generate script." };
  }

}