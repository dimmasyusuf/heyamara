import { Resend } from "resend";
import { VerifyEmail } from "@/components/email";

export const resend = new Resend(process.env.AUTH_RESEND_API_KEY!);

export const sendVerificationRequest = async (params: {
  identifier: string;
  url: string;
}) => {
  try {
    await resend.emails.send({
      from: process.env.AUTH_RESEND_FROM!,
      to: params.identifier,
      subject: "Your magic link to sign in! - Hey Amara",
      react: VerifyEmail({ url: params.url, email: params.identifier }),
    });
  } catch (error) {
    console.log({ error });
  }
};
