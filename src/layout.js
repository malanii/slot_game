import "./styles/style.css";
import { loadProgressHandler, deleteLoadProgressHandler } from "./loading";
import { loadGameContainer } from "./gameFlow";

const slotGame = () => {
  PIXI.Loader.shared
    .add("./src/assets/atlas.json")
    .on("progress", loadProgressHandler)
    .load(
      setTimeout(() => {
        deleteLoadProgressHandler(), loadGameContainer();
      }, 1000)
    );
};
slotGame();
