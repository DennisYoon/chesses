import { Mode } from "./types4game";

export function checkURL(urlStr: string) {
  const mode = new URL(urlStr).searchParams.get("mode");

  if (mode === "classic") {
    return Mode.classic;
  } else if (mode === "customizable") {
    return Mode.customizable;
  } else if (mode === "tenXten") {
    return Mode.tenXten;
  } else {
    return Mode.null;
  }
}