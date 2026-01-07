import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12"><div className="max-w-md mx-auto p-6 text-center">Loading…</div></div>}>
      <LoginClient />
    </Suspense>
  );
}
