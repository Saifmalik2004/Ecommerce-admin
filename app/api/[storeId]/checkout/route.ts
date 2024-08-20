import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // Authenticate the user (optional based on your use case)
    const body = await req.json();
    const { phone, address, productIds } = body;

    // Validate input fields
    if (!phone) {
      return new NextResponse("Phone is required", {
        status: 400,
        headers: corsHeaders,
      });
    }
    if (!address) {
      return new NextResponse("Address is required", {
        status: 400,
        headers: corsHeaders,
      });
    }
    if (!productIds || !productIds.length) {
      return new NextResponse("ProductIds are required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Create a new order in the database
    const order = await prismadb.order.create({
      data: {
        phone,
        address,
        isPaid: true,
        storeId: params.storeId,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    await prismadb.product.updateMany({
    where:{
        id:{
            in:[...productIds]
        }
    },
    data:{
        isArchived:true
    }
    })
    
    

    // Return the newly created order as the response
    return  NextResponse.json(order, { headers: corsHeaders });
  } catch (error) {
    console.log("[ORDERS_POST]", error);
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}



