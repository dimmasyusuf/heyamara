"use client";

import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import Logo from "@/assets/brand/logo.svg";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export default function VerifyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-9">
      <Link href="/" className="m-auto flex w-fit items-center justify-center">
        <Image src={Logo} alt="Acme Inc." width={56} height={56} />
      </Link>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl">Verify your email</h1>
        <div className="flex flex-col items-center text-center text-sm">
          <p>Enter the code we&apos;ve sent to your email.</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-sm">Didn&apos;t receive the code?</p>
            <Button
              size="sm"
              variant="link"
              className="h-fit rounded-none p-0 text-sm underline hover:no-underline"
            >
              Resend
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="size-14 text-lg" />
                        <InputOTPSlot index={1} className="size-14 text-lg" />
                        <InputOTPSlot index={2} className="size-14 text-lg" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="size-14 text-lg" />
                        <InputOTPSlot index={4} className="size-14 text-lg" />
                        <InputOTPSlot index={5} className="size-14 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-12 w-full">
              Verify
            </Button>
          </form>
        </Form>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Link
          href="/auth"
          className="text-xs text-muted-foreground underline hover:text-primary"
        >
          Terms of Service
        </Link>
        <Separator orientation="vertical" className="h-3" />
        <Link
          href="/auth"
          className="text-xs text-muted-foreground underline hover:text-primary"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
