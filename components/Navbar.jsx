import Image from 'next/image'
import React from 'react'
import { Button, buttonVariants } from './ui/button'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { prisma } from '@/app/utils/db';
import { redirect } from 'next/navigation';


const Navbar = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()


  let isPremium = false;

  if (user) {
    let subscription = await prisma.UserSubscription.findFirst({
      where: {
        kindeId: user.id,
      },
    });

    if (!subscription) {
      subscription = await prisma.UserSubscription.create({
        data: {
          kindeId: user.id,
          isPremium: false,
        },
      });
    }

    isPremium = subscription.isPremium;
  }


  const subscribe = async ()=>{
    "use server"
    await prisma.UserSubscription.update({
      where: {
        kindeId: user.id
      },
      data:{
        isPremium:true
      }
    })
    redirect("/")
  }



  return (

    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
      <Image src="/logo.png" alt="logo" width={120} height={30} />
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <h1 className="text-base font-medium"> {user.given_name}</h1>
            <LogoutLink
              className={buttonVariants({ variant: "destructive" })}
            >
              Logout
            </LogoutLink>
            <form action={subscribe} >
              <Button disabled={isPremium} type="submit" className={"bg-green-700"}>{isPremium ? "Subscribed" : "Subscribe Now"}</Button>

            </form>
          </>
        ) : (
          <>
            <LoginLink className={buttonVariants({ variant: "default" })}>
              Login
            </LoginLink>
            <RegisterLink
              className={buttonVariants({ variant: "secondary" })}
            >
              Register Now
            </RegisterLink>
          </>
        )}
      </div>
    </nav>

  )
}

export default Navbar