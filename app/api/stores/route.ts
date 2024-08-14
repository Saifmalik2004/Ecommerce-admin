import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth(); // Authenticate the user
    const body = await req.json(); // Parse the request body
    const { name } = body; // Extract the name from the body

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Validate the name field
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Create a new store in the database
    const store = await prismadb.store.create({
      data: {
        name,
        userId
        // createdAt and updatedAt will be automatically handled by Prisma
      },
    });

    // Return the newly created store as the response
    return NextResponse.json(store);

  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
