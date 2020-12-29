import app from "./app";
import loadingContainer from "./loading";
import { winning, deleteWinningScreen } from "./winning";
let game = new PIXI.Container();
export default game;
export function loadGameContainer() {
  app.stage.removeChild(loadingContainer);
  app.stage.addChild(game);
  setup();
}
export function setup() {
  let bg = new PIXI.Sprite(PIXI.utils.TextureCache["BG.png"]);

  bg.anchor.set(0.5);
  bg.position.set(app.screen.width / 2, app.screen.height / 2);
  game.addChild(bg);
  let btnArr = [];
  let btnActive = new PIXI.Sprite(PIXI.utils.TextureCache["BTN_Spin.png"]);
  let btnDisable = new PIXI.Sprite(PIXI.utils.TextureCache["BTN_Spin_d.png"]);
  btnArr.push(btnActive, btnDisable);
  btnArr.map((el) => {
    el.anchor.set(0.5);
    el.interactive = true;
    el.position.set(
      app.screen.width / 2 + game.width / 2 - btnActive.width + 10,
      app.screen.height / 2
    );
  });
  game.addChild(btnActive);
  btnActive.on("click", () => {
    startPlay();
  });

  btnDisable.on("click", () => {
    reelsComplete();
  });
  // ___________________slots_______________________________
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
  const SYMBOL_SIZE = 180;
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
  //set reelContainer position
  reelContainer.x = app.screen.width / 2 + 35;
  reelContainer.y = app.screen.height / 2 + 600;
  reelContainer.pivot.x = reelContainer.width / 2;
  reelContainer.pivot.y = reelContainer.height / 2;
  //mask
  let g = new PIXI.Graphics();
  g.beginFill(0, 1);
  g.drawRect(0, 0, bg.width + 125, bg.height + 110);
  g.endFill();
  game.addChild(g);
  reelContainer.mask = g;
  // start and end game
  let running = false;
  function startPlay() {
    spinsCount++;

    if (spinsCount === 5) {
      running = false;
      winning();
      setTimeout(() => {
        spinsCount = 0;
        deleteWinningScreen();
      }, 3000);
    }

    if (spinsCount < 5) {
      gameToggleElements(btnActive, btnDisable);
      if (running) return;
      running = true;
      for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        const extra = Math.floor(Math.random() * 3);
        const target = r.position + 10 + i * 5 + extra;
        const time = 2500 + i * 600 + extra * 600;
        tweenTo(
          r,
          "position",
          target,
          time,
          backout(0.5),
          null,
          i === reels.length - 1 ? reelsComplete : null
        );
      }
    }
  }

  function reelsComplete() {
    gameToggleElements(btnDisable, btnActive);
    running = false;
  }
  app.ticker.add((delta) => {
    // Update the slots.
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;
      // Update symbol positions on reel.
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;
        s.y =
          (((r.position + j) % r.symbols.length) - 1) * SYMBOL_SIZE -
          SYMBOL_SIZE * 2;
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          s.texture =
            slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }
  });

  const tweening = [];
  function tweenTo(
    object,
    property,
    target,
    time,
    easing,
    onchange,
    oncomplete
  ) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };
    tweening.push(tween);
    return tween;
  }
  app.ticker.add((delta) => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);
      t.object[t.property] = lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      );
      if (t.change) t.change(t);
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
  });
  function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
  }
  function backout(amount) {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
  }
  let spinsCount = 0;
}

function gameToggleElements(itemToRemove, itemToAdd) {
  game.removeChild(itemToRemove);
  game.addChild(itemToAdd);
}
