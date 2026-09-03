import {
  ConvexBetterAuthProvider,
  type AuthClient,
} from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from "./App";
import { authClient } from "./auth-client";
import "./index.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

if (!convexUrl || !convexSiteUrl) {
  throw new Error(
    "VITE_CONVEX_URL and VITE_CONVEX_SITE_URL are required. Start the backend once to generate apps/web/.env.local.",
  );
}

const convex = new ConvexReactClient(convexUrl, { expectAuth: true });
const queryClient = new QueryClient();
// The component's exported AuthClient union does not preserve cross-domain plugin inference.
const providerAuthClient = authClient as unknown as AuthClient;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexBetterAuthProvider authClient={providerAuthClient} client={convex}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <App />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ConvexBetterAuthProvider>
  </StrictMode>,
);
