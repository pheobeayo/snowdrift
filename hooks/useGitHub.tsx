"use client";
import * as React from "react";

export interface GitHubUser {
  login: string;
  avatarUrl: string;
}

interface GitHubContextValue {
  user: GitHubUser | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
}

const GitHubContext = React.createContext<GitHubContextValue | null>(null);

// Demo identity returned by the stub until real OAuth is wired in.
const DEMO_USER: GitHubUser = {
  login: "pheobeayo",
  avatarUrl: "https://avatars.githubusercontent.com/u/106414815?v=4",
};

export function GitHubProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<GitHubUser | null>(null);
  const [isConnecting, setIsConnecting] = React.useState(false);

  const connect = React.useCallback(() => {
    // TODO: replace with real GitHub OAuth (NextAuth `signIn("github")`
    // or a popup to /api/auth/github). For now, simulate the round-trip.
    setIsConnecting(true);
    setTimeout(() => {
      setUser(DEMO_USER);
      setIsConnecting(false);
    }, 600);
  }, []);

  const disconnect = React.useCallback(() => setUser(null), []);

  const value = React.useMemo(
    () => ({
      user,
      isConnected: !!user,
      isConnecting,
      connect,
      disconnect,
    }),
    [user, isConnecting, connect, disconnect]
  );

  return (
    <GitHubContext.Provider value={value}>{children}</GitHubContext.Provider>
  );
}

export function useGitHub() {
  const ctx = React.useContext(GitHubContext);
  if (!ctx) {
    throw new Error("useGitHub must be used within a GitHubProvider");
  }
  return ctx;
}

/** Non-throwing accessor — returns null when no GitHubProvider is mounted.
 *  Used by cross-engine components that render on the Tasks side too. */
export function useGitHubOptional() {
  return React.useContext(GitHubContext);
}