import {
  AuthUIProvider,
  AuthView,
  type AuthViewPaths,
} from "@daveyplate/better-auth-ui";
import { useState, type ComponentProps } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "./auth-client";

export default function BoatHouseAuthDialog({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const [authView, setAuthView] = useState<keyof AuthViewPaths>("SIGN_IN");

  function navigate(to: string, replace = false) {
    if (to.endsWith("/sign-up")) {
      setAuthView("SIGN_UP");
    } else if (to.endsWith("/sign-in")) {
      setAuthView("SIGN_IN");
    } else {
      onOpenChange(false);
    }

    window.history[replace ? "replaceState" : "pushState"]({}, "", to);
  }

  function AuthLink({
    href,
    children,
    className,
  }: Pick<ComponentProps<"a">, "children" | "className" | "href"> & { href: string }) {
    return (
      <a
        className={className}
        href={href}
        onClick={(event) => {
          event.preventDefault();
          navigate(href);
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <AuthUIProvider
      authClient={authClient}
      credentials={{ forgotPassword: false }}
      Link={AuthLink}
      navigate={navigate}
      replace={(to) => navigate(to, true)}
      redirectTo="/"
    >
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className="boat-auth-dialog">
          <DialogTitle className="sr-only">Boat House authentication</DialogTitle>
          <AuthView className="boat-auth-card" view={authView} />
        </DialogContent>
      </Dialog>
    </AuthUIProvider>
  );
}
