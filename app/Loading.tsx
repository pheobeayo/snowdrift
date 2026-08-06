import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-56 animate-pulse rounded bg-line-1" />
        <div className="mt-2 h-4 w-full max-w-xl animate-pulse rounded bg-line-1" />
      </div>

      <div className="flex gap-3">
        <div className="h-9 w-64 animate-pulse rounded-md bg-line-1" />
        <div className="h-9 w-52 animate-pulse rounded-md bg-line-1" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="h-3 w-40 animate-pulse rounded bg-line-1" />
              <div className="mt-2 h-5 w-2/3 animate-pulse rounded bg-line-1" />
              <div className="mt-3 flex gap-1.5">
                <div className="h-5 w-20 animate-pulse rounded-full bg-line-1" />
                <div className="h-5 w-24 animate-pulse rounded-full bg-line-1" />
              </div>
              <div className="mt-4 h-9 w-full animate-pulse rounded-lg bg-line-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
