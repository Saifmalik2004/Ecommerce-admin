// backend-app/app/api/[storeId]/contact/route.ts
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

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
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await request.json();
    const { name, email, subject, message, userId } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Log the submission
    console.log("Contact Form Submission:", {
      storeId: params.storeId,
      name,
      email,
      subject,
      message,
      userId,
      timestamp: new Date().toISOString(),
    });

   
   
    await prismadb.contactSubmission.create({
      data: {
        storeId: params.storeId,
        name,
        email,
        subject,
        message,
        userId,
      },
    });
    

  
    

    // Add CORS headers
    const response = new NextResponse("Message sent successfully", { headers: corsHeaders });
   
    return response;
  } catch (error) {
    console.error(`[CONTACT_POST] Error for storeId ${params.storeId}:`, error);
      return new NextResponse("Internal error", {
        status: 500,
        headers: corsHeaders,
      });
  }
}
