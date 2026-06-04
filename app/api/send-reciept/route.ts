import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your secret API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const order = await request.json();

    // Create a clean HTML receipt template
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h1 style="color: #0f172a; font-size: 24px;">Order Complete! 🎉</h1>
        <p style="color: #64748b;">Hi there,</p>
        <p style="color: #64748b;">Great news! Your order <strong>#${order.id.split('-')[0]}</strong> has been successfully processed and is now complete.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Receipt Summary</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${order.items.map((item: any) => `
              <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
                <span>${item.quantity}x ${item.name}</span>
                <strong>₦${(item.price * item.quantity).toLocaleString()}</strong>
              </li>
            `).join('')}
          </ul>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 18px;">
            <strong>Total Paid:</strong>
            <strong>₦${order.total_amount.toLocaleString()}</strong>
          </div>
        </div>

        <p style="color: #64748b; font-size: 14px;"><strong>Delivered to:</strong> <br/>${order.delivery_address}</p>
        
        ${order.transfer_note ? `<p style="color: #64748b; font-size: 14px;"><strong>Note:</strong> <br/>${order.transfer_note}</p>` : ''}

        <p style="color: #64748b; margin-top: 30px;">Thank you for trusting HezTec!</p>
      </div>
    `;

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'HezTec Orders <dahez@heztec.com>', // Change this to your actual domain email once you verify your domain on Resend
      to: [order.user_email],
      subject: `HezTec Receipt - Order #${order.id.split('-')[0]}`,
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