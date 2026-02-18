"use client";


import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import {  SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import useStoreUser from "../hooks/use-store-user";
import { Plus, Ticket } from "lucide-react";

const Header = () => {

  const { isLoading } = useStoreUser();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b ">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between ">
          {/* logo  */}
          <Link href={"/"}>
          <Image
          alt="logoSync"
            src="/sync.png"
            width={500}
            height={500}
            className="max-w-30"
            priority
          />
          </Link>

          {/* pro badge */}

          {/* search and location --desktop only */}

          {/* right side actions */}
          <div className="flex items-center">
               {/* create event  */}
                <Button variant="ghost" className="mr-2" size="sm" onClick={() => setShowUpgradeModal(true)}  >
                  Pricing
                </Button>
                <Button variant="ghost" className="mr-2" size="sm" >
                  <Link href="explore">Explore</Link>
                </Button>
            <Authenticated>
              <Button size="sm" asChild className="flex gap-2 mr-4">
                <Link href="/create-event">
                <Plus className="w-4 h-4"/>
                <span className="hidden sm:inline">Create Event</span>
                </Link>
              </Button>
             
                <UserButton >
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

 <Button size="sm" className="mr-2" >Sign In</Button>
                </SignInButton>
              </Unauthenticated>
               
          </div>
        </div>

        {/* mobile search and location  */}

        {/* loader */}

        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#575757" />
          </div>
        )}
      </nav>

      {/* modals  */}
    </>
  );
};

export default Header;
