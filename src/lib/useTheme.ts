import { useEffect } from "react";
import { applyAccent, cloudAccent, savedAccent } from "./accent";
import { applyChromeColors } from "./telegram";

export function useTheme(): void {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = "dark";
    applyAccent(savedAccent());
    cloudAccent().then((accent) => {
      if (accent) applyAccent(accent);
    });
    const ground = getComputedStyle(root).getPropertyValue("--ground").trim();
    applyChromeColors(/^#[0-9a-f]{6}$/i.test(ground) ? ground : "#000000");
  }, []);
}
