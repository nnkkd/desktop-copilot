import React from "react";
import Config from "./Config";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Config />
      <div className="">{children}</div>
    </>
  );
};

export default Layout;
