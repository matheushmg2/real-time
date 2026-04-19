import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<object>;

const ConversationsLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default ConversationsLayout;
