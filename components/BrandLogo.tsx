import Image from "next/image";
import { assetPath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  mode?: "light" | "dark" | "auto";
  height?: number;
  width?: number;
}

export default function BrandLogo({
  className,
  mode = "auto",
  height = 32,
  width = 83,
}: BrandLogoProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Image
        src={assetPath("/img/logos/altLogo.svg")}
        alt="Cube AI"
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-200",
          mode === "dark"
            ? "hidden"
            : mode === "auto"
              ? "dark:hidden block"
              : "block",
        )}
        priority
      />

      <Image
        src={assetPath("/img/logos/sidebarLogo.svg")}
        alt="Cube AI"
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-200",
          mode === "light"
            ? "hidden"
            : mode === "auto"
              ? "hidden dark:block"
              : "block",
        )}
        priority
      />
    </div>
  );
}
