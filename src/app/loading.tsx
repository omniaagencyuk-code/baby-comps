export default function Loading() {
  return (
    <div className="container flex items-center justify-center py-32">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
