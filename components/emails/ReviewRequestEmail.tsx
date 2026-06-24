import * as React from "react";
import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Row,
  Column,
} from "@react-email/components";

interface ReviewEmailProps {
  customerName: string;
  orderId: string;
  items: { id: string; name: string }[];
}

export default function ReviewRequestEmail({
  customerName,
  orderId,
  items,
}: ReviewEmailProps) {
  return (
    <Html>
      <Preview>Your HezTec order has been delivered! How did we do?</Preview>
      <Body style={{ backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
        <Container style={{ backgroundColor: "#ffffff", margin: "40px auto", padding: "40px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          
          <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: "0 0 20px 0" }}>
            Project Delivered! 🚀
          </Text>
          
          <Text style={{ fontSize: "16px", color: "#475569", lineHeight: "1.5" }}>
            Hi {customerName},
          </Text>
          
          <Text style={{ fontSize: "16px", color: "#475569", lineHeight: "1.5" }}>
            Your HezTec order (#{orderId.slice(0, 8).toUpperCase()}) has been marked as delivered. We hope the components are working perfectly for your project!
          </Text>

          <Text style={{ fontSize: "16px", color: "#475569", lineHeight: "1.5" }}>
            Authentic feedback from engineers like you helps our community make better decisions. Could you take 60 seconds to drop a 5-star review on the hardware you received?
          </Text>

          {/* Loop through their purchased items and create a direct link to each */}
          <Section style={{ marginTop: "32px", marginBottom: "32px" }}>
            {items.map((item) => (
              <Row key={item.id} style={{ marginBottom: "16px" }}>
                <Column>
                  <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
                    {item.name}
                  </Text>
                </Column>
                <Column align="right">
                  <Link
                    href={`https://heztec.com/shop/${item.id}`}
                    style={{
                      backgroundColor: "#16a34a",
                      color: "#ffffff",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Leave Review
                  </Link>
                </Column>
              </Row>
            ))}
          </Section>

          <Text style={{ fontSize: "14px", color: "#94a3b8", marginTop: "40px" }}>
            Thank you for trusting HezTec Innovation Labs.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}