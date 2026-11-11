
import Link from "next/link";
import { Boxes } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.9fr)]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-[#111827] p-12 text-white lg:flex xl:p-16">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 size-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <Link href="/login" className="relative flex w-fit items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-white">
            <Boxes size={24} />
          </span>
          <span>
            <span className="block text-xl font-bold tracking-tight">
              Stockeeper
            </span>
            <span className="block text-[10px] tracking-[0.16em] text-gray-400">
              BUSINESS MANAGEMENT
            </span>
          </span>
        </Link>

        <div className="relative max-w-lg">
          <p className="text-sm font-semibold tracking-[0.18em] text-indigo-300">
            YOUR BUSINESS, ORGANIZED
          </p>
          <h2 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
            Take control of your inventory and business operations.
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-gray-400">
            Manage products, monitor stock, track sales, and make informed
            business decisions from one workspace.
          </p>
        </div>

        <p className="relative text-xs text-gray-500">
          © 2026 Stockeeper. All rights reserved.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 flex justify-center lg:hidden">
            <Link href="/login" className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white">
                <Boxes size={22} />
              </span>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Stockeeper
              </span>
            </Link>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
