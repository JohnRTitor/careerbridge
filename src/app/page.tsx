import { HomeClientContainer } from "@/features/home/components/home-client-container";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HomeClientContainer />
      </main>
    </div>
  );
}
