import "./styles/style.css";
import { loadProgressHandler } from "./loading";
import { loadGameContainer } from "./gameContainer";

const slotGame = () => {
  PIXI.Loader.shared
    .add("./src/assets/atlas.json")
    .on("progress", loadProgressHandler)
    .load(
      setTimeout(() => {
        loadGameContainer();
      }, 1000)
    );
};
slotGame();
