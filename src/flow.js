import app from "./app";
import { deleteWinningScreen, winning } from "./winning";

let game = new PIXI.Container();
let reelContainer = new PIXI.Container();
let spinsCount = 0;
let running = false;
const REEL_WIDTH = 240;
const SYMBOL_SIZE = 180;
const btnArr = [];
const reels = [];
const tweening = [];

export function loadGameContainer() {
  app.stage.addChild(game);
  launchGame();
}

export function launchGame() {
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
    endPlay();
  });
  // Game starts
  const slotTextures = [
    PIXI.Texture.from("SYM1.png"),
    PIXI.Texture.from("SYM3.png"),
    PIXI.Texture.from("SYM4.png"),
    PIXI.Texture.from("SYM5.png"),
    PIXI.Texture.from("SYM6.png"),
    PIXI.Texture.from("SYM7.png"),
  ];
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

    for (let j = 0; j < 4; j++) {
      let symbol = new PIXI.Sprite(
        slotTextures[Math.floor(Math.random() * slotTextures.length)]
      );
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
  reelContainer.position.set(
    app.screen.width / 2 + 35,
    app.screen.height / 2 + 510
  );
  reelContainer.pivot.set(reelContainer.width / 2, reelContainer.height / 2);
  app.stage.addChild(reelContainer);
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
          i === reels.length - 1 ? endPlay : null
        );
      }
    }
  }
  function endPlay() {
    gameToggleElements(btnDisable, btnActive);
    running = false;
  }
  app.ticker.add(() => {
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;
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
  app.ticker.add(() => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
      let t = tweening[i];
      let phase;
      if (running) {
        phase = Math.min(1, (now - t.start) / t.time);
      }
      if (!running) {
        phase = 1;
      }
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
}

function lerp(a1, a2, t) {
  return a1 * (1 - t) + a2 * t;
}
function backout(amount) {
  return (t) => --t * t * ((amount + 1) * t + amount) + 1;
}
function gameToggleElements(itemToRemove, itemToAdd) {
  game.removeChild(itemToRemove);
  game.addChild(itemToAdd);
}
export default game;
