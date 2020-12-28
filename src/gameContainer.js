import app from "./app";
import loadingContainer from "./loading";

let gameContainer = new PIXI.Container();

export function loadGameContainer() {
  app.stage.removeChild(loadingContainer);
  app.stage.addChild(gameContainer);
  setup();
}


export function setup() {
  let bg = new PIXI.Sprite(PIXI.utils.TextureCache["BG.png"]);
  bg.anchor.set(0.5);
  bg.position.set(app.screen.width / 2, app.screen.height / 2);
  gameContainer.addChild(bg);

  let btnArr = [];
  let btnActive = new PIXI.Sprite(PIXI.utils.TextureCache["BTN_Spin.png"]);
  let btnDisable = new PIXI.Sprite(PIXI.utils.TextureCache["BTN_Spin_d.png"]);
  btnArr.push(btnActive, btnDisable);
  btnArr.map((el) => {
    el.anchor.set(0.5);
    el.interactive = true;
    el.position.set(
      app.screen.width / 2 + gameContainer.width / 2 - btnActive.width + 10,
      app.screen.height / 2
    );
  });
  gameContainer.addChild(btnActive);

  btnActive.on("click", () => {
    startPlay();
  });

  btnDisable.on("click", () => {
    endPlay();
  });

  //  ___________________slots_______________________________

  const slotTextures = [
    PIXI.Texture.from("SYM1.png"),
    PIXI.Texture.from("SYM3.png"),
    PIXI.Texture.from("SYM4.png"),
    PIXI.Texture.from("SYM5.png"),
    PIXI.Texture.from("SYM6.png"),
    PIXI.Texture.from("SYM7.png"),
  ];
  // Build the reels
  const REEL_WIDTH = 240;
  const SYMBOL_SIZE = 150;
  const reels = [];
  let reelContainer = new PIXI.Container();
  for (let i = 0; i < 3; i++) {
    let rc = new PIXI.Container();
    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);
    const reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.filters.BlurFilter(),
    };
    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];
    // Build the symbols
    for (let j = 0; j < 3; j++) {
      let symbol = new PIXI.Sprite(
        slotTextures[Math.floor(Math.random() * slotTextures.length)]
      );
      // Scale the symbol to fit symbol area.
      symbol.y = j * SYMBOL_SIZE;
      symbol.anchor.set(0.5);
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height
      );
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  reelContainer.x = app.screen.width / 2 + 20;
  reelContainer.y = app.screen.height / 2 + 60;
  // Center bunny sprite in local container coordinates
  reelContainer.pivot.x = reelContainer.width / 2;
  reelContainer.pivot.y = reelContainer.height / 2;

  function startPlay() {
    gameContainer.removeChild(btnActive);
    gameContainer.addChild(btnDisable);
    console.log("game starts");
  }

  function endPlay() {
    gameContainer.removeChild(btnDisable);
    gameContainer.addChild(btnActive);
    console.log("game ends");
  }
}

export default gameContainer;
