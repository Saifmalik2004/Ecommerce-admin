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
    const { 
    name,
    price,
    categoryId,
    colorId,
    sizeId,
    images,
    isFeatured,
    isArchived,
    description,
 } = body; // Extract the name from the body

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

   
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!images || !images.length) {
        return new NextResponse("images is required", { status: 400 });
      }
    if (!price) {
        return new NextResponse("Price is required", { status: 400 });
      }
    
    if (!categoryId) {
        return new NextResponse("CategoryId is required", { status: 400 });
      }

    if (!colorId) {
        return new NextResponse("ColorId is required", { status: 400 });
      }

   
      if (!description) {
        return new NextResponse("description is required", { status: 400 });
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
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        colorId,
        sizeId :sizeId || null,
        categoryId,
        description,
        storeId:params.storeId,
        images:{
            createMany:{
                data:[
                    ...images.map((image:{url:string})=> image)
                ]
            }
        }
      },
    });

    // Return the newly created store as the response
    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}




export async function GET(
    req: Request,
    {params}:{params:{storeId:string}}
) {
  try {
    const {searchParams} = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;
    if (!params.storeId) {
      return new NextResponse("store is required", { status: 401 });
    }

const products = await prismadb.product.findMany({
  where:{
    storeId:params.storeId,
    categoryId,
    colorId,
    sizeId,
    isFeatured: isFeatured ? true: undefined,
    isArchived:false
    
  },
  include:{
    images:true,
    category:true,
    color:true,
    size:true,
  },
  orderBy:{
    createdAt:"desc"
  }
})

    // Return the newly created store as the response
    return NextResponse.json(products);

  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
