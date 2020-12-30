import app from "./app";
import game from "./flow";

export function loadUICanvas() {
  let bg = new PIXI.Sprite(PIXI.utils.TextureCache["BG.png"]);
  bg.anchor.set(0.5);
  bg.position.set(app.screen.width / 2, app.screen.height / 2);
  game.addChild(bg);

  let visibleScreen = new PIXI.Graphics();
  visibleScreen.beginFill(0, 1);
  visibleScreen.drawRect(
    0,
    (app.screen.height - bg.height) / 2,
    app.screen.width,
    bg.height
  );
  visibleScreen.endFill();
  game.addChild(visibleScreen);
  app.stage.mask = visibleScreen;
}
