import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Tailwind,
  pixelBasedPreset,
} from "@react-email/components";

interface EmailTemplateProps {
  url: string;
  email: string;
}

export default function VerifyEmail({ url, email }: EmailTemplateProps) {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              brand: "#171717",
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <Preview>Your magic link to sign in! - Hey Amara</Preview>
        <Body className="bg-white font-sans">
          <Container className="mx-auto flex max-w-lg bg-white px-6 py-10">
            {/* Header with Logo */}
            <Img
              src="https://heyamara.app/apple-icon.png"
              width="56"
              height="56"
              alt="Hey Amara"
              className="mb-8"
            />

            {/* Main Content */}
            <Section>
              <Heading className="mb-2 font-sans text-2xl font-semibold leading-tight text-gray-900">
                Welcome to Hey Amara!
              </Heading>
              <Text className="my-0 font-sans text-base leading-relaxed text-gray-600">
                Click the button below to sign in to your account. This link
                will expire in 10 minutes and can only be used once.
              </Text>

              {/* Magic Link Button */}
              <Section className="my-8">
                <Link
                  href={url}
                  className="cursor-pointer rounded-md border-none bg-gray-900 px-6 py-3 text-center font-sans text-sm font-medium text-white no-underline transition-colors duration-200 hover:bg-gray-800"
                >
                  Click to sign in
                </Link>
              </Section>

              <Text className="my-0 font-sans text-base leading-relaxed text-gray-600">
                If you didn't request this email, you can safely ignore it. Your
                account will remain secure.
              </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            {/* Footer */}
            <Section>
              <Text className="my-2 font-sans text-sm leading-relaxed text-gray-600">
                This email was sent to {email || "your email address"}
              </Text>
              <Text className="my-2 font-sans text-sm leading-relaxed text-gray-600">
                If you have any questions, please contact our support team.
              </Text>
              <Text className="my-2 font-sans text-sm leading-relaxed text-gray-600">
                © 2025 Hey Amara. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
