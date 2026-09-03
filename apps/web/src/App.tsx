import {
  Anchor,
  KeyRound,
  LoaderCircle,
  LogIn,
  LogOut,
  ShipWheel,
  Sparkles,
  Waves,
} from "lucide-react";
import { lazy, Suspense, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "./auth-client";

const BoatHouseAuthDialog = lazy(() => import("./BoatHouseAuthDialog"));

function Welcome() {
  return (
    <main className="welcome-screen">
      <Card className="welcome-card">
        <ShipWheel className="welcome-wheel" />
        <p className="overline">Identity begrudgingly confirmed</p>
        <h1>Welcome to the Boat House app</h1>
        <Button onClick={() => authClient.signOut()} type="button">
          <LogOut /> Log out before it gets weird
        </Button>
      </Card>
    </main>
  );
}

function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  function openLogin() {
    window.history.pushState({}, "", "/auth/sign-in");
    setIsAuthOpen(true);
  }

  function handleDialogChange(open: boolean) {
    setIsAuthOpen(open);
    if (!open) {
      window.history.replaceState({}, "", "/");
    }
  }

  return (
      <main className="landing-shell">
        <div className="water-stripes" aria-hidden="true" />
        <header className="site-header">
          <a className="logo" href="#top" aria-label="The Boat House home">
            <span><Anchor /></span>
            <b>THE BOAT HOUSE</b>
            <small>household excellence plc*</small>
          </a>
          <Button className="login-button" onClick={openLogin} type="button">
            <KeyRound /> Log in
          </Button>
        </header>

        <div className="ticker" aria-hidden="true">
          <span>WELCOME ABOARD *** SHOES OFF IN THE HOUSE *** THIS IS NOT A BOAT *** LAST ONE OUT CHECKS THE OVEN ***</span>
        </div>

        <section className="hero" id="top">
          <div className="hero-copy">
            <Badge className="eyebrow" variant="destructive">
              <Sparkles /> Award-winning shared accommodation*
            </Badge>
            <h1>All hands<br />on <em>deck.</em></h1>
            <p className="hero-description">
              The official digital headquarters for a completely normal group of friends living in a house inexplicably called the Boat House.
            </p>
            <Button className="hero-login" onClick={openLogin} size="lg" type="button">
              Access the Boat House <LogIn />
            </Button>
            <small className="legal">*No awards. No company. Limited maritime capability.</small>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="sun">HOT<br />PROPERTY</div>
            <ShipWheel className="giant-wheel" />
            <div className="house-boat">
              <div className="roof"><span /></div>
              <div className="house-body">
                <div className="window">?</div>
                <div className="door">NO<br />SOLICITING</div>
                <div className="window">!</div>
              </div>
              <div className="boat-bottom">HMS COUNCIL TAX</div>
            </div>
            <Waves className="wave wave-one" />
            <Waves className="wave wave-two" />
            <div className="approval-stamp">100%<br /><b>SEAWORTHY</b><br /><small>according to nobody</small></div>
          </div>
        </section>

        <footer className="site-footer">
          <span>BEST VIEWED ON THE KITCHEN LAPTOP</span>
          <b>VISITOR No. 0000042</b>
          <span>© {new Date().getFullYear()} BOAT HOUSE MINISTRY OF VIBES</span>
        </footer>

        {isAuthOpen && (
          <Suspense fallback={<div className="auth-loading"><LoaderCircle className="spin" /> Preparing the gangplank...</div>}>
            <BoatHouseAuthDialog onOpenChange={handleDialogChange} open />
          </Suspense>
        )}
      </main>
  );
}

function App() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <main className="loading-screen"><LoaderCircle className="spin" /> Consulting the harbourmaster...</main>;
  }

  return session ? <Welcome /> : <LandingPage />;
}

export default App;
