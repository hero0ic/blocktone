import AppHeader from "@/components/AppHeader";
import GameSession from "@/components/GameSession";
import { Suspense } from "react";

export default function ItemsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-4 sm:pb-16">
        <Suspense fallback={<div className="text-muted font-body">Loading...</div>}>
          <GameSession category="item" />
        </Suspense>
      </main>
    </div>
  );
}
