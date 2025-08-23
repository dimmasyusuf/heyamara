"use client";

import Image from "next/image";
import Link from "next/link";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Logo from "@/assets/brand/logo.svg";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export default function AuthForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleGoogle = async () => {
    await signIn("google");
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-9">
      <Link href="/" className="m-auto flex w-fit items-center justify-center">
        <Image src={Logo} alt="Acme Inc." width={56} height={56} />
      </Link>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl">Log in or sign up</h1>
        <div className="text-center text-sm">
          You&apos;ll streamline hiring, save time, and get more done with
          AI-powered tools.
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email address"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-12 w-full">
              Continue
            </Button>
          </form>
        </Form>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 font-medium text-muted-foreground">
            OR
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full"
          onClick={handleGoogle}
        >
          <FcGoogle className="size-4" />
          Continue with Google
        </Button>
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
