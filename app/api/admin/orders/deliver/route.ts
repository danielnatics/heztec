import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Grab the order ID sent from the admin button
    const { orderId } = await request.json();

    // 2. Fetch the current order details securely from Supabase
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Update the Order Status to "delivered"
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "delivered" })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update order status in database" }, { status: 500 });
    }

    // 4. PREPARE THE EMAIL DATA
    const shortOrderId = order.id.split('-')[0].toUpperCase();
    const customerName = order.user_email.split("@")[0]; // Simple fallback for name

    // 5. Build the HTML Email (Matching your HezTec Receipt Style)
    const reviewHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        
        <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 5px; color: #0f172a;">HezTec</h1>
        <h2 style="font-size: 14px; color: #64748b; font-weight: normal; margin-top: 0; margin-bottom: 30px; text-transform: uppercase;">ORDER #${shortOrderId} DELIVERED</h2>
        
        <h2 style="font-size: 22px; color: #0f172a;">Project Delivered! 🚀</h2>
        <p style="color: #475569; font-size: 15px; margin-bottom: 15px; line-height: 1.5;">Hi ${customerName},</p>
        <p style="color: #475569; font-size: 15px; margin-bottom: 30px; line-height: 1.5;">Your HezTec order has been marked as delivered. We hope the components are working perfectly for your engineering project!</p>
        <p style="color: #475569; font-size: 15px; margin-bottom: 25px; line-height: 1.5;">Authentic feedback from engineers like you helps our community make better decisions. Could you take 60 seconds to drop a 5-star review on the hardware you received?</p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 40px;">
          <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 16px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Rate your components</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            ${order.items.map((item: any) => `
              <tr>
                <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                  <span style="font-weight: 600; color: #0f172a; font-size: 15px;">${item.name}</span>
                </td>
                <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; text-align: right;">
                  <a href="https://heztec.com/shop/${item.id}" style="background-color: #16a34a; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block;">Leave Review</a>
                </td>
              </tr>
            `).join('')}
          </table>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; font-size: 14px; color: #64748b; text-align: center;">
          Thank you for trusting HezTec Innovation Labs.<br/>
          <a href="https://heztec.com/shop" style="color: #2563eb; text-decoration: none; display: inline-block; margin-top: 10px;">Visit our store</a>
        </div>
      </div>
    `;

    // 6. Send the Email via Resend
    const { error: resendError } = await resend.emails.send({
      from: 'HezTec Orders <orders@heztec.com>', // Ensure this matches your verified Resend domain
      to: [order.user_email],
      replyTo: 'getheztec@gmail.com',
      subject: `Your HezTec order was delivered! Leave a review? ⭐`,
      html: reviewHtml,
    });

    if (resendError) {
      console.error("Resend Error:", resendError);
      throw new Error("Database updated, but email failed to send.");
    }

    return NextResponse.json({ success: true, message: "Order updated and email sent!" });

  } catch (error: any) {
    console.error("Delivery API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}