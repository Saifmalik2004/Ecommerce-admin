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
    const { name,value } = body; // Extract the name from the body

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Validate the label and imageurl field
    if (!name) {
      return new NextResponse("NAME is required", { status: 400 });
    }

    if (!value) {
        return new NextResponse("Value is required", { status: 400 });
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
    // Create a new BILLBOARD in the database
    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId:params.storeId
      },
    });

    // Return the newly created store as the response
    return NextResponse.json(size);

  } catch (error) {
    console.log('[SIZES_POST]', error);
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

const sizes = await prismadb.size.findMany({
  where:{
    storeId:params.storeId,
    
  }
})

    
    return NextResponse.json(sizes);

  } catch (error) {
    console.log('[SIZES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
