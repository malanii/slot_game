import app from "./app";

let loadingContainer = new PIXI.Container();
let loadingLine = new PIXI.Graphics();
let loadingText = new PIXI.Text("Loading......", {
  fontSize: 36,
  fontWeight: "bold",
  fill: "#ffffff",
});
let p = 0;
loadingText.anchor.set(0.5);
loadingText.position.set(app.screen.width / 2, app.screen.height / 2);
loadingLine.position.set(
  app.screen.width / 2 - loadingText.width,
  app.screen.height / 2 + loadingText.height
);
loadingContainer.addChild(loadingText, loadingLine);

export function loadProgressHandler() {
  app.stage.addChild(loadingContainer);
  animate();
}
export function deleteLoadProgressHandler() {
  app.stage.removeChild(loadingContainer);
}
function animate() {
  if (p < 1.0) {
    p += 0.01;
    loadingLine.lineStyle(20, 0x59ffff);
    loadingLine.lineTo(420 * p, 0);
    app.renderer.render(app.stage);
    requestAnimationFrame(animate);
  }
}
export default loadingContainer;
