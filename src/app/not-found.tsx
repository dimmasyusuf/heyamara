import Image from "next/image";
import Link from "next/link";

import Thinking from "@/assets/image/thinking.png";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <section className="m-auto flex h-dvh w-full max-w-lg flex-col items-center justify-center gap-6 p-6">
      <Image
        src={Thinking}
        alt="404 Not Found"
        width={208}
        height={208}
        className="shrink-0 grow-0"
      />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-pro-gray text-xl font-bold">Page Not Found</h1>
        <p className="text-pro-gray-200 whitespace-nowrap text-center text-base">
          Sorry, the page you are looking for doesn&apos;t exist
          <br />
          or has been moved.
        </p>
      </div>

      <Button variant="outline" asChild>
        <Link href="/">Back to Homepage</Link>
      </Button>
    </section>
  );
}
