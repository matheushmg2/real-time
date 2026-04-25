"use client";

import { Card } from "@/components/ui/card";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<object>;

export const ConversationContainer = ({ children }: Props) => {
  return (
    <Card className="w-full h-[calc(100svh-32px)] lg:h-full p-2 flex flex-col gap-2">
      {children}
    </Card>
  );
};
