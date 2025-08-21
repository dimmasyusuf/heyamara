"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { ChevronRightIcon, ServerCrashIcon } from "lucide-react";

import Fonts from "@/assets/font";
import Flame from "@/assets/image/flame.png";

import { AmaraSheet } from "@/components/sheet";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";

import Providers from "@/providers";

export default function ErrorPage({
  error,
  //   reset,
}: {
  error: Error & { digest?: string; cause?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <body className={`${Fonts} bg-background font-sans antialiased`}>
        <Providers>
          <>
            <section className="m-auto flex h-dvh w-full max-w-lg flex-col items-center justify-center gap-6 p-6">
              <Image
                src={Flame}
                alt="Error"
                width={208}
                height={208}
                className="shrink-0 grow-0"
              />

              <div className="flex flex-col items-center gap-2">
                <h1 className="text-pro-gray text-xl font-bold">
                  Something went wrong
                </h1>
                <p className="text-pro-gray-200 whitespace-nowrap text-center text-base">
                  We&apos;re working to resolve the issue as quickly as
                  possible.
                  <br />
                  Please try again in a few minutes.
                </p>
              </div>

              <div
                className={cn(
                  "flex w-full items-center gap-6",
                  isDevelopment ? "justify-between" : "justify-center",
                )}
              >
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={() => router.back()}>
                    Back
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>

                {isDevelopment && (
                  <AmaraSheet
                    icon={<ServerCrashIcon />}
                    title={error.name}
                    className="min-w-[512px]"
                    button={<Button variant="outline">Detail</Button>}
                  >
                    <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden p-5">
                      <Collapsible className="group" defaultOpen>
                        <div className="border-pro-snow-200 flex flex-col rounded-lg border">
                          <CollapsibleTrigger className="border-pro-snow-300 flex items-center justify-between gap-2 p-4 group-data-[state=open]:border-b">
                            <span className="text-sm font-semibold">
                              General
                            </span>
                            <ChevronRightIcon className="size-5 shrink-0 grow-0 transition-all duration-300 group-data-[state=open]:rotate-90" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2 p-4 font-mono">
                            <div className="flex items-start gap-2">
                              <span className="whitespace-nowrap text-xs font-semibold">
                                Timestamp:
                              </span>
                              <span className="text-xs">
                                {format(new Date(), "yyyy-MM-dd HH:mm:ss a")}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="whitespace-nowrap text-xs font-semibold">
                                URL:
                              </span>
                              <span className="text-xs">
                                {window.location.href}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="whitespace-nowrap text-xs font-semibold">
                                Environment:
                              </span>
                              <span className="text-xs uppercase">
                                {process.env.NODE_ENV}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="whitespace-nowrap text-xs font-semibold">
                                User Agent:
                              </span>
                              <span className="text-xs">
                                {navigator.userAgent}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="whitespace-nowrap text-xs font-semibold">
                                Viewport:
                              </span>
                              <span className="text-xs">
                                {window.innerWidth}x{window.innerHeight}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="whitespace-nowrap text-xs font-semibold">
                                Platform:
                              </span>
                              <span className="text-xs">
                                {navigator.platform}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="whitespace-nowrap text-xs font-semibold">
                                Language:
                              </span>
                              <span className="text-xs">
                                {navigator.language}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="whitespace-nowrap text-xs font-semibold">
                                Cookies Enabled:
                              </span>
                              <span className="text-xs">
                                {navigator.cookieEnabled ? "Yes" : "No"}
                              </span>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>

                      <Collapsible className="group" defaultOpen>
                        <div className="border-pro-snow-200 flex flex-col rounded-lg border">
                          <CollapsibleTrigger className="border-pro-snow-300 flex items-center justify-between gap-2 p-4 group-data-[state=open]:border-b">
                            <span className="text-sm font-semibold">
                              Message
                            </span>
                            <ChevronRightIcon className="size-5 shrink-0 grow-0 transition-all duration-300 group-data-[state=open]:rotate-90" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed">
                            {error.message ?? "N/A"}
                          </CollapsibleContent>
                        </div>
                      </Collapsible>

                      <Collapsible className="group" defaultOpen>
                        <div className="border-pro-snow-200 flex flex-col rounded-lg border">
                          <CollapsibleTrigger className="border-pro-snow-300 flex items-center justify-between gap-2 p-4 group-data-[state=open]:border-b">
                            <span className="text-sm font-semibold">Cause</span>
                            <ChevronRightIcon className="size-5 shrink-0 grow-0 transition-all duration-300 group-data-[state=open]:rotate-90" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed">
                            {error.cause ?? "N/A"}
                          </CollapsibleContent>
                        </div>
                      </Collapsible>

                      <Collapsible className="group" defaultOpen>
                        <div className="border-pro-snow-200 flex flex-col rounded-lg border">
                          <CollapsibleTrigger className="border-pro-snow-300 flex items-center justify-between gap-2 p-4 group-data-[state=open]:border-b">
                            <span className="text-sm font-semibold">
                              Digest
                            </span>
                            <ChevronRightIcon className="size-5 shrink-0 grow-0 transition-all duration-300 group-data-[state=open]:rotate-90" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed">
                            {error.digest ?? "N/A"}
                          </CollapsibleContent>
                        </div>
                      </Collapsible>

                      <Collapsible className="group" defaultOpen>
                        <div className="border-pro-snow-200 flex flex-col rounded-lg border">
                          <CollapsibleTrigger className="border-pro-snow-300 flex items-center justify-between gap-2 p-4 group-data-[state=open]:border-b">
                            <span className="text-sm font-semibold">Stack</span>
                            <ChevronRightIcon className="size-5 shrink-0 grow-0 transition-all duration-300 group-data-[state=open]:rotate-90" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="whitespace-pre-wrap break-words bg-gray-50 p-4 font-mono text-xs leading-relaxed">
                            {error.stack ?? "N/A"}
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    </div>
                  </AmaraSheet>
                )}
              </div>
            </section>
          </>
        </Providers>
      </body>
    </html>
  );
}
