"use server"


import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { prisma } from "./utils/db"
import { redirect } from "next/navigation"
import Razorpay from "razorpay";
import crypto from "crypto";
import { revalidatePath } from "next/cache";


const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function saveScript(formData) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) throw new Error("Unauthorized")

  const content = formData.get("script")

  const savedScript = await prisma.Script.create({
    data: {
      content,
      kindeId: user.id,
    },
  })


  redirect(`/prompt/${savedScript.id}`)
}



export async function subscribeUser(kindeId) {
  const subscription = await prisma.userSubscription.update({
    where: { kindeId },
    data: { isPremium: true },
  });

  return subscription;
}

export async function createSubscriptionOrder()
{
  const {getUser} = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    throw new Error("You must be logged in to subscribe.");
  }

    const options = {
    amount: 10000, // Amount in paise (e.g., ₹999.00)
    currency: "INR",
    receipt: `receipt_user_${user.id}_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    // We need to serialize the order object to safely pass it to the client
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Could not create payment order.");
  }


}