import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    {params}:{params:{storeId:string}}
) {
  try {
    const { userId } = auth(); // Authenticate the user
    const body = await req.json(); // Parse the request body
    const { name,billboardId } = body; // Extract the name from the body

   
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    
    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!billboardId) {
        return new NextResponse("billboardId is required", { status: 400 });
      }

    if (!params.storeId) {
        return new NextResponse("storeId is required", { status: 401 });
      }

const storeByUserId = await prismadb.store.findFirst({
  where:{
    id:params.storeId,
    userId
  }
})

if (!storeByUserId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
    // Create a new category in the database
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId:params.storeId
      },
    });

    // Return the newly created category as the response
    return NextResponse.json(category);

  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}




export async function GET(
    req: Request,
    {params}:{params:{storeId:string}}
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store is required", { status: 401 });
    }

const categories = await prismadb.category.findMany({
  where:{
    storeId:params.storeId,
    
  }
})

    // Return the newly created categories as the response
    return NextResponse.json(categories);

  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
