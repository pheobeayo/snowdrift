"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import { useGitHubOptional } from "@/hooks/useGitHub";


export function EngineSwitchLink({
  href,
  from,
  onNavigate,
  className,
  children,
}: {
  href: string;
  from: "tasks" | "opensource";
  onNavigate?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { disconnect: disconnectWallet } = useDisconnect();
  const github = useGitHubOptional();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (from === "tasks") {
      disconnectWallet();
    } else {
      github?.disconnect();
    }
    onNavigate?.();
    router.push(href);
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}