import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth(); // Authenticate the user
    const body = await req.json(); // Parse the request body
    const { label, imageUrl, textColor } = body; // Extract fields

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Validate fields
    if (!label) {
      return new NextResponse("label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("imageUrl is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 401 });
    }

    if (!["black", "white"].includes(textColor)) {
      return new NextResponse("Invalid textColor value", { status: 400 });
    }

    // Validate store ownership
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Create a new Billboard
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        textColor,
        storeId: params.storeId
      },
    });

    // Return the new billboard
    return NextResponse.json(billboard);

  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 401 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      }
    });

    // Return the list of billboards
    return NextResponse.json(billboards);

  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
