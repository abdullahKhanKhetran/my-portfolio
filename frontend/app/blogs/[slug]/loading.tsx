export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-3">
        <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
          cd ~/blogs
        </p>
        <p className="text-zinc-500 dark:text-zinc-400">
          Loading blog post...
        </p>
      </div>
    </div>
  );
}
