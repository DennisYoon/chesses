import { Mode } from "./types4game";
import { waitUntil } from "./waitUntil";

const promotionWindow = document.querySelector<HTMLElement>("#promotionWindow")!;
const options = document.querySelectorAll("#promotionGrid div")!;

export async function promotion(mode: Mode) {
  let toPromote = "";

  function listner(myName: string) {
    return () => {
      toPromote = myName;
    };
  }

  promotionWindow.style.visibility = "visible";
  if (mode === Mode.tenXten) {
    document.querySelector<HTMLElement>("#promotionGrid #special")!.style.visibility = "visible";
  }

  options.forEach(option => {
    option.addEventListener("click", listner(option.textContent!));
  });

  await waitUntil(() => toPromote !== "");

  options.forEach(option => {
    option.removeEventListener("click", listner(option.textContent!));
  });
  
  promotionWindow.style.visibility = "hidden";
  if (mode === Mode.tenXten) {
    document.querySelector<HTMLElement>("#special")!.style.visibility = "hidden";
  }

  return toPromote;
}