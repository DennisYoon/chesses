export function applyFullscreen() {
  const fullscreenDIV = document.querySelector("#full");
  const fullscreenIMG = document.querySelector("#fullscreen");
  
  fullscreenDIV?.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      fullscreenIMG?.setAttribute("src", "../imgs/exit-fullscreen.png");
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        fullscreenIMG?.setAttribute("src", "../imgs/fullscreen.png");
        document.exitFullscreen();
      }
    }
  });
}
