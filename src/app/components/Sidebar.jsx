import React from "react";
import { FaCompass } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";
import { FaUserTie } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import logo from "../images/finifi_logo.jpg";

const Sidebar = () => {
  return (
    <div className="w-2/12 flex items-center flex-col bg-sky-50 p-8 sticky top-0 h-auto tablet:w-screen tablet:flex-row tablet:justify-between tablet:p-4 mobile:w-screen mobile:flex-row mobile:p-2 mobile:justify-between">
      <Image
        src={logo}
        alt="Finifi Logo"
        className="w-24 h-24 mr-auto mobile:w-12 mobile:h-12"
      />

      <div className="flex flex-col gap-5 justify-center items-center mt-8 w-full h-auto laptop:mt-10 laptop:gap-3 tablet:flex-row tablet:w-8/12 tablet:mt-0 mobile:flex-row mobile:w-auto mobile:mt-0 mobile:gap-4">
        <Link
          href="/"
          className="flex flex-row gap-5 w-full h-12 items-center justify-center cursor-pointer rounded-l-[50px] hover:bg-sky-900 group mr-1 laptop:gap-3 laptop:mr-2 tablet:hover:bg-transparent tablet:mr-0 mobile:hover:bg-transparent mobile:mr-0"
        >
          <FaCompass className="text-sky-900 font-light text-xl font-poppins group-hover:text-dark-white laptop:text-lg tablet:hidden mobile:hidden" />
          <span className="text-sky-900 font-light text-xl font-poppins group-hover:text-dark-white laptop:text-lg tablet:text-md mobile:text-sm tablet:group-hover:text-sky-400">
            Dashboard
          </span>
        </Link>

        <Link
          href="/pages/invoices"
          className="flex flex-row gap-5 w-full h-12 items-center justify-center cursor-pointer rounded-l-[50px] hover:bg-sky-900 group pr-7 laptop:gap-3 laptop:pr-4 tablet:hover:bg-transparent tablet:pr-0 mobile:hover:bg-transparent mobile:pr-0"
        >
          <HiDocumentText className="text-sky-900 font-light text-xl font-poppins group-hover:text-dark-white laptop:text-lg tablet:hidden mobile:hidden" />
          <span className="text-sky-900 font-light text-xl font-poppins group-hover:text-dark-white laptop:text-lg tablet:text-md mobile:text-sm tablet:group-hover:text-sky-400 mobile:group-hover:text-sky-400">
            Invoices
          </span>
        </Link>

        <Link
          href="/pages/vendors"
          className="flex flex-row gap-5 w-full h-12 items-center justify-center cursor-pointer rounded-l-[50px] hover:bg-sky-900 group pr-7 laptop:gap-3 laptop:pr-4 tablet:hover:bg-transparent tablet:pr-0 mobile:hover:bg-transparent mobile:pr-0"
        >
          <FaUserTie className="text-sky-900 font-light text-xl font-poppins group-hover:text-dark-white laptop:text-lg tablet:hidden mobile:hidden" />
          <span className="text-sky-900 font-light text-xl font-poppins group-hover:text-dark-white laptop:text-lg tablet:text-md mobile:text-sm tablet:group-hover:text-sky-400 mobile:group-hover:text-sky-400">
            Vendors
          </span>
        </Link>

        <Link
          href="/pages/settings"
          className="flex flex-row gap-5 w-full h-12 items-center justify-center cursor-pointer rounded-l-[50px] hover:bg-sky-900 group pr-7 laptop:gap-3 laptop:pr-4 tablet:hover:bg-transparent tablet:pr-0 mobile:hover:bg-transparent mobile:pr-0"
        >
          <FiSettings className="text-sky-900 font-light text-xl font-poppins group-hover:text-dark-white laptop:text-lg tablet:hidden mobile:hidden" />
          <span className="text-sky-900 font-light text-xl font-poppins group-hover:text-dark-white laptop:text-lg tablet:text-md mobile:text-sm tablet:group-hover:text-sky-400 mobile:group-hover:text-sky-400">
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
