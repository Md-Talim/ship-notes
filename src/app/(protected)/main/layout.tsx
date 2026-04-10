import { auth } from "@clerk/nextjs/server";
import { Navbar } from "./navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) return redirectToSignIn();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />

      {children}
    </div>
  );
}
