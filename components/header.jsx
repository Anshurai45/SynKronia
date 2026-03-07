"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import useStoreUser from "../hooks/use-store-user";
import { Crown, Plus, Ticket } from "lucide-react";
import { OnboardingModal } from "./onboarding-modal";
import { useOnboarding } from "@/hooks/use-onboarding";
import SearchLocationBar from "./search-location-bar";
import { Badge } from "./ui/badge";
import UpgradeModal from "./upgrade-modal";

const Header = () => {
  const { isLoading } = useStoreUser();

  const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } =
    useOnboarding();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { has } = useAuth();

  const hasPro = has?.({ plan: "pro" });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl  z-20 border-b ">
        <div className="max-w-7xl mx-auto  flex items-center justify-evenly  h-20 ">
          {/* logo  */}
          <Link href={"/"}>
            <div className="text-white font-extrabold text-xl tracking-tight mb-1">
              SYNK<span className="text-purple-400">RONIA</span>
            </div>
          </Link>

          {/* pro badge */}
          {hasPro && (
            <Badge className="bg-linear-to-r from-pink-500 to-orange-500 gap-1 text-white ml-3">
              <Crown className="h-3 w-3" />
              Pro
            </Badge>
          )}

          {/* search and location --desktop only */}

          <div className="hidden  md:flex flex-1 justify-center ">
            <SearchLocationBar />
          </div>

          {/* right side actions */}
          <div className="flex items-center">
            {/* create event  */}
            {!hasPro && (
              <Button
                variant="ghost"
                className="mr-2"
                size="sm"
                onClick={() => setShowUpgradeModal(true)}
              >
                Pricing
              </Button>
            )}
            <Button variant="ghost" className="mr-2" size="sm">
              <Link href="explore">Explore</Link>
            </Button>
            <Authenticated>
              <Button size="sm" asChild className="flex gap-2 mr-4">
                <Link href="/create-event">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Event</span>
                </Link>
              </Button>

              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={16} />}
                    href="/my-tickets"
                  />
                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Ticket size={16} />}
                    href="/my-events"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </Authenticated>

            <Unauthenticated>
              <SignInButton mode="modal">
                <Button size="sm" className="mr-2">
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>

        {/* mobile search and location  */}
        <div className="md:hidden border-t px-3 py-3 ">
          <SearchLocationBar />
        </div>

        {/* loader */}

        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#575757" />
          </div>
        )}
      </nav>

      {/* modals  */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingSkip}
        onComplete={handleOnboardingComplete}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="header"
      />
    </>
  );
};

export default Header;
