import { CreateForm } from "@/components/CreateForm";

function Header(): React.ReactNode {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-3xl font-bold">URL Redirector</div>
      <div className="text-muted-foreground text-sm">
        no more loooooong URLs
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <main className="w-screen flex justify-center flex-col items-center py-24 max-md:py-8 px-4">
      <Header />
      <div className="my-3" />

      <CreateForm />
    </main>
  );
}
