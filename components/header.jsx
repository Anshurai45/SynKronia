import Image from "next/image";
import React from "react";
import Link from "next/link";

const Header = () => {
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
        </div>

        {/* mobile search and location  */}
      </nav>

      {/* modals  */}
    </>
  );
};

export default Header;
