import { Mode } from "./types4game";
import { checkURL } from "./urlChecker";
import { body, o, x } from "./dom";

export async function urlAccess(url: string) {
  if (checkURL(url) === Mode.null) {
    body?.classList.add("impossibleURL");
    o?.classList.add("hideEle");
  } else {
    body?.classList.add("possibleURL");
    x?.classList.add("hideEle");
    return;
  }
}
