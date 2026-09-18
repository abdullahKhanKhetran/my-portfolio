export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-3">
        <p className="font-mono text-sm text-emerald-600">
          ~/blogs
        </p>
        <p className="text-zinc-500">
          Loading blog posts...
        </p>
      </div>
    </div>
  );
}
