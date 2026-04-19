import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<object>;

const Layout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default Layout;
