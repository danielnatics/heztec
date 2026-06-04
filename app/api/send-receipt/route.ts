import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your secret API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const order = await request.json();
    const shortOrderId = order.id.split('-')[0].toUpperCase();

    // Create a clean HTML receipt template matching the brand layout
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        
        <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 5px; color: #0f172a;">HezTec</h1>
        <h2 style="font-size: 14px; color: #64748b; font-weight: normal; margin-top: 0; margin-bottom: 30px; text-transform: uppercase;">RECEIPT FOR ORDER #${shortOrderId}</h2>
        
        <h2 style="font-size: 22px; color: #0f172a;">Payment Successful 🎉</h2>
        <p style="color: #475569; font-size: 15px; margin-bottom: 25px;">Great news! We have confirmed your payment. Your order is now fully processed and preparing for dispatch.</p>

        <div style="margin-bottom: 40px; display: flex; align-items: center; gap: 15px;">
          <a href="https://heztec.com/orders" style="background-color: #059669; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">View your order</a>
          <span style="color: #64748b; font-size: 14px;">or <a href="https://heztec.com/shop" style="color: #2563eb; text-decoration: none;">Visit our store</a></span>
        </div>

        <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; font-size: 18px; color: #0f172a;">Receipt summary</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${order.items.map((item: any) => `
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                <span style="font-weight: 600; color: #0f172a; font-size: 15px;">${item.name.length > 20 ? item.name.slice(0, 23) + "..." : item.name}</span>              
                <span style="color: #64748b; font-size: 14px; margin-left: 5px;">× ${item.quantity}</span>
              </td>
              <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: #0f172a; font-size: 15px;">
                ₦${(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          `).join('')}
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 15px;">
          <tr>
            <td style="padding: 8px 0; color: #475569;">Subtotal</td>
            <td style="padding: 8px 0; text-align: right; color: #0f172a;">₦${order.total_amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #475569;">Shipping</td>
            <td style="padding: 8px 0; text-align: right; color: #0f172a;">Calculated at delivery</td>
          </tr>
          <tr>
            <td style="padding: 15px 0; border-top: 1px solid #e2e8f0; font-weight: bold; font-size: 18px; color: #0f172a;">Total</td>
            <td style="padding: 15px 0; border-top: 1px solid #e2e8f0; text-align: right; font-weight: bold; font-size: 18px; color: #0f172a;">₦${order.total_amount.toLocaleString()} NGN</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #059669; font-weight: bold;">Total paid today</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #059669;">₦${order.total_amount.toLocaleString()} NGN</td>
          </tr>
        </table>

        <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; font-size: 18px; color: #0f172a;">Delivery information</h3>
        <div style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
          <strong style="color: #0f172a; display: block; margin-bottom: 5px;">Shipping address</strong>
          ${order.delivery_address.replace(/\n/g, '<br/>')}
        </div>

        // ${order.transfer_note ? `
        // <div style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 40px;">
        //   <strong style="color: #0f172a; display: block; margin-bottom: 5px;">Order Note</strong>
        //   ${order.transfer_note}
        // </div>` : ''}

        <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; font-size: 14px; color: #64748b; text-align: center;">
          Thank you for trusting HezTec! Reply to this email if you need anything.
        </div>
      </div>
    `;

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'HezTec <dahez@heztec.com>', 
      to: [order.user_email],
      replyTo: 'getheztec@gmail.com', // Routes customer replies straight to your inbox
      subject: `Payment Receipt - Order #${shortOrderId}`,
      html: htmlContent,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}