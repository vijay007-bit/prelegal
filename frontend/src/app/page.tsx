import { NdaCreator } from "@/components/NdaCreator";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            prelegal
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mutual NDA Creator
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Fill in the details on the left; the agreement updates as you type. When every
            field is complete you can download the finished document as a PDF.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <NdaCreator />
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-xs text-zinc-500 sm:px-6">
        This generator produces a general-purpose template and is not legal advice. Have a
        qualified lawyer review any agreement before signing.
      </footer>
    </div>
  );
}
