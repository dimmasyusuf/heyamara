"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import EmailImage from "@/assets/image/email.png";
import { Button } from "@/components/ui/button";

export default function VerifyForm() {
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const email = sessionStorage.getItem("email");

  useEffect(() => {
    const savedEndTime = sessionStorage.getItem("resend");

    if (savedEndTime) {
      const remaining = Math.ceil((parseInt(savedEndTime) - Date.now()) / 1000);
      if (remaining > 0) {
        setCountdown(remaining);
      } else {
        sessionStorage.removeItem("resend");
      }
    }

    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            sessionStorage.removeItem("resend");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = () => {
    if (countdown > 0) return;

    setIsResending(true);
    const endTime = Date.now() + 30 * 1000;
    sessionStorage.setItem("resend", endTime.toString());
    setCountdown(30);

    signIn("resend", { email });
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-9">
      <Link href="/" className="m-auto flex w-fit items-center justify-center">
        <Image src={EmailImage} alt="Email" width={128} height={128} />
      </Link>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl">You're ready to go!</h1>
        <p className="text-center text-sm">
          We've sent you an email with a verification code. Please check your
          inbox and enter the code to continue.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button type="button" variant="outline" className="h-12 w-full" asChild>
          <Link href="https://mail.google.com" target="_blank">
            <FcGoogle className="size-4" />
            Open Gmail
          </Link>
        </Button>

        <div className="flex items-center gap-1">
          <p className="text-sm">Didn&apos;t receive the code?</p>
          <Button
            size="sm"
            variant="link"
            className="h-fit rounded-none p-0 text-sm underline hover:no-underline disabled:no-underline disabled:opacity-50"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
          >
            {countdown > 0 ? `${formatTime(countdown)}` : "Resend"}
          </Button>
        </div>
      </div>
    </div>
  );
}
