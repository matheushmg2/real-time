import { Card } from "@/components/ui/card";

export const ConversationFallback = () => {
  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center text-secondary">
      Select/start a conversation to get started!
    </Card>
  );
};
