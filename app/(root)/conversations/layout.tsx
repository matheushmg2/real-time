import ItemList from "@/components/shared/item-list/ItemList";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<object>;

const ConversationsLayout = ({ children }: Props) => {
  return <>
    <ItemList title="Conversations">Conversations Layout</ItemList>
    {children}
    </>;
};

export default ConversationsLayout;
