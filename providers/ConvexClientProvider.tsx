"use client";

import { ClerkProvider, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { ReactNode } from "react";
import LoadingLogo from "@/components/shared/LoadingLogo";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string,
);

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        
        <AuthLoading>
          <LoadingLogo />
        </AuthLoading>

        <Unauthenticated>
          <RedirectToSignIn />
        </Unauthenticated>

        <Authenticated>
          {children}
        </Authenticated>

      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClerkProvider;
// 27:55