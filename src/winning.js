import app from "./app";

let winningContainer = new PIXI.Container();

export function winning() {
  let bgWidth = PIXI.Texture.from("BG.png").width;
  let bgHeight = PIXI.Texture.from("BG.png").height;
  let winningBg = new PIXI.Graphics();
  winningBg.beginFill(0x0e4853, 0.7);
  winningBg.drawRect(
    (app.screen.width - bgWidth) / 2 + 70,
    app.screen.height - bgHeight,
    717,
    bgHeight / 2
  );
  winningBg.endFill();
  let winningText = new PIXI.Text("YOU WON!", {
    fontSize: 76,
    fontWeight: "bold",
    fill: "#f9ea02",
  });
  winningText.anchor.set(0.6, 0.5);
  winningText.position.set(app.screen.width / 2, app.screen.height / 2);
  winningContainer.addChild(winningBg, winningText,winningClickScreen);
  app.stage.addChild(winningContainer);
}

let winningClickScreen = new PIXI.Graphics();
winningClickScreen.beginFill(0xfffff, 0.001);
winningClickScreen.drawRect(0, 0, app.screen.width, app.screen.height);
winningClickScreen.endFill();
winningClickScreen.interactive = true;
winningClickScreen.on("click", () => {
    deleteWinningScreen();
});

export function deleteWinningScreen() {
  winningContainer.removeChildren();
}
