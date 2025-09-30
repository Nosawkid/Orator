import { prisma } from "@/app/utils/db";

export async function GET(req, { params }) {
  let subscription = await prisma.userSubscription.findUnique({
    where: { kindeId: await params.id },
  });

  if (!subscription) {
    subscription = await prisma.userSubscription.create({
      data: {
        kindeId: await params.id,
        isPremium: false, 
      },
    });
  }

  return new Response(
    JSON.stringify({ exists: true, isPremium: subscription.isPremium }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
