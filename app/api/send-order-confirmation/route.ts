import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { order, customerName } = await request.json();
    const shortOrderId = order.id.split('-')[0].toUpperCase();

    // 1. Email to the Customer (Matching the PDF Document Style without images)
    const customerHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        
        <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 5px; color: #0f172a;">HezTec</h1>
        <h2 style="font-size: 14px; color: #64748b; font-weight: normal; margin-top: 0; margin-bottom: 30px; text-transform: uppercase;">ORDER #${shortOrderId}</h2>
        
        <h2 style="font-size: 22px; color: #0f172a;">Thank you for your order!</h2>
        <p style="color: #475569; font-size: 15px; margin-bottom: 25px;">You'll get a confirmation email after completing your payment.</p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="margin-top: 0; font-size: 16px; color: #0f172a;">Payment Details</h3>
          <p style="margin: 0 0 5px 0; font-size: 14px; color: #475569;">Bank: <strong style="color: #0f172a;">OPAY</strong></p>
          <p style="margin: 0 0 5px 0; font-size: 14px; color: #475569;">Account Number: <strong style="color: #0f172a; font-size: 16px;">9116319581</strong></p>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #475569;">Account Name: <strong style="color: #0f172a;">Egwuatu Daniel Chibuzor</strong></p>
          <p style="margin: 0; font-size: 14px; color: #475569;">Amount <strong style="color: #0f172a;">₦${order.total_amount.toLocaleString()}</strong>.</p>
        </div>

        <div style="margin-bottom: 40px; display: flex; align-items: center; gap: 15px;">
          <a href="https://heztec.com/orders" style="background-color: #2563eb; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">View your order</a>
          <span style="color: #64748b; font-size: 14px;"> or <a href="https://heztec.com/shop" style="color: #2563eb; text-decoration: none;">Visit our store</a></span>
        </div>

        <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; font-size: 18px; color: #0f172a;">Order summary</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${order.items.map((item: any) => `
            <tr>
              <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                <span style="font-weight: 600; color: #0f172a; font-size: 15px;">${item.name}</span> 
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
            <td style="padding: 8px 0; color: #475569;">Total paid today</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0f172a;">₦0.00 NGN</td>
          </tr>
        </table>

        <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; font-size: 18px; color: #0f172a;">Customer information</h3>
        <div style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 40px;">
          <strong style="color: #0f172a; display: block; margin-bottom: 5px;">Shipping address</strong>
          ${customerName}<br/>
          ${order.delivery_address.replace(/\n/g, '<br/>')}
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; font-size: 14px; color: #64748b; text-align: center;">
          If you have any questions, reply to this email or contact us at <a href="mailto:getheztec@gmail.com" style="color: #2563eb;">getheztec@gmail.com</a>
        </div>
      </div>
    `;

    // 2. Alert Email to Admin (You)
    const adminHtml = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #059669;">New Order Received: #${shortOrderId}</h2>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerName} (${order.user_email})</p>
          <p style="margin: 5px 0;"><strong>Value:</strong> ₦${order.total_amount.toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Address:</strong> ${order.delivery_address}</p>
        </div>
        <a href="https://heztec.com/admin/orders" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Admin Dashboard</a>
      </div>
    `;

    // Send both emails in parallel
    await Promise.all([
      resend.emails.send({
        from: 'HezTec <orders@heztec.com>',
        to: [order.user_email],
        replyTo: 'getheztec@gmail.com',
        subject: `Order #${shortOrderId} confirmed`,
        html: customerHtml,
      }),
      resend.emails.send({
        from: 'HezTec System <orders@heztec.com>',
        to: ['getheztec@gmail.com'], // Alerts your admin email
        subject: `🚨 New Order: ₦${order.total_amount.toLocaleString()}`,
        html: adminHtml,
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}