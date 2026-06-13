import AppHeader from "@/components/AppHeader";
import HomeCard from "@/components/HomeCard";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader showNav={false} />
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-4 sm:pb-16">
        <HomeCard />
      </main>
    </div>
  );
}
