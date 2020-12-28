import app from "./app";

let loadingContainer = new PIXI.Container();

let loadingText = new PIXI.Text("Loading......", {
  fontSize: 36,
  fontWeight: "bold",
  fill: "#ffffff",
});
loadingText.anchor.set(0.5);
loadingText.x = app.screen.width / 2;
loadingText.y = app.screen.height / 2;

let loadingLine = new PIXI.Graphics();
loadingLine.x = app.screen.width / 2 - loadingText.width;
loadingLine.y = app.screen.height / 2 + loadingText.height;

let p = 0;
export function loadProgressHandler() {
  app.stage.addChild(loadingContainer);
  animate();
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

loadingContainer.addChild(loadingText);
loadingContainer.addChild(loadingLine);

export default loadingContainer;
