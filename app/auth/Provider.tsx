"use client";

import { SessionProvider, type SessionProviderProps } from "next-auth/react";
import React, { PropsWithChildren, type ReactNode } from "react";

const CompatibleSessionProvider = SessionProvider as unknown as (
  props: SessionProviderProps,
) => ReactNode;

const AuthProvider = ({ children }: PropsWithChildren) => {
  return <CompatibleSessionProvider>{children}</CompatibleSessionProvider>;
};
export default AuthProvider;
