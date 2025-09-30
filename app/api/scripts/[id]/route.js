import { prisma } from "@/app/utils/db";

export async function GET(req,{params})
{
    const script = await prisma.Script.findUnique({
        where: {id:params?.id}
    })
      if (!script) return new Response("Not found", { status: 404 })
    
     return Response.json(script)
}