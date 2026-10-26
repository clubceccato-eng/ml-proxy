import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { FashionReel, FPS, totalFrames } from "./FashionReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="FashionReel"
        component={FashionReel}
        durationInFrames={totalFrames()}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
