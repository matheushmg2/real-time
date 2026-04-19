import SidebarWrapper from "@/components/shared/sidebar/SidebarWrapper";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<object>;

const Layout = ({ children }: Props) => {
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default Layout;
