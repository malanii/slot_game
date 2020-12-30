import app from "./app";
import {winningClickScreen} from "./gameFlow";

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
  winningText.x = app.screen.width / 2;
  winningText.y = app.screen.height / 2;




  winningContainer.addChild(winningBg, winningText);
  app.stage.addChild(winningContainer);
}

// window.app = app;
// app.renderer.plugins.interaction.on('pointerdown', deleteWinningScreen);





export function deleteWinningScreen() {
  app.stage.removeChild (winningClickScreen)
  winningContainer.removeChildren();
}
