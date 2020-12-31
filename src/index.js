import "./styles/style.css";
import { loadProgressHandler, deleteLoadProgressHandler } from "./loading";
import { loadGameContainer } from "./flow";
import { loadUICanvas } from "./ui";

const slotGame = () => {
  PIXI.Loader.shared
    .add("./src/assets/atlas.json")
    .on("progress", loadProgressHandler)
    .load(
      setTimeout(() => {
        loadUICanvas(), deleteLoadProgressHandler(), loadGameContainer();
      }, 1000)
    );
};
slotGame();
