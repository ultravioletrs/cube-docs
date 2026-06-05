import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import BrandLogo from "@/components/BrandLogo";

export const gitConfig = {
  user: "ultravioletrs",
  repo: "cube",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <BrandLogo className="h-10 w-auto" height={40} width={104} />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
