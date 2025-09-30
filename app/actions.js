"use server"


import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { prisma } from "./utils/db"
import { redirect } from "next/navigation"
import Razorpay from "razorpay";
import crypto from "crypto";
import { revalidatePath } from "next/cache";




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



export async function subscribeUser(kindeId) {
  const subscription = await prisma.userSubscription.update({
    where: { kindeId },
    data: { isPremium: true },
  });

  return subscription;
}

