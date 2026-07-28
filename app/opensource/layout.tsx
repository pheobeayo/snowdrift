import { OpenSourceShell } from "@/components/layout/OpenSourceShell";

export default function OpenSourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OpenSourceShell>{children}</OpenSourceShell>;
}
