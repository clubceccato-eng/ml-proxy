import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 30;

// Tiempos en segundos dentro de cada archivo original (GoPro).
// Los clips van en video/public/ con estos nombres.
type Clip = {
  file: string;
  from: number; // segundo de inicio en el archivo
  to: number; // segundo de fin en el archivo
  impact?: boolean; // zoom de rebote al entrar (momento del corte)
};

const t = (min: number, sec: number) => min * 60 + sec;

export const CLIPS: Clip[] = [
  // PRENDA 1 - remera
  { file: "GX011769.MP4", from: t(1, 23), to: t(1, 30) },
  // PRENDA 1 - remera puesta (duración de 2s a confirmar)
  { file: "GX011769.MP4", from: t(1, 51), to: t(1, 53), impact: true },
  // PRENDA 2 y 3 - siguen en GX021769, completar tiempos:
  // { file: "GX021769.MP4", from: t(0, 0), to: t(0, 0) },
  // { file: "GX021769.MP4", from: t(0, 0), to: t(0, 0), impact: true },
];

export const END_TEXT_SECONDS = 3;

const clipFrames = (c: Clip) => Math.round((c.to - c.from) * FPS);

export const totalFrames = () =>
  CLIPS.reduce((acc, c) => acc + clipFrames(c), 0) + END_TEXT_SECONDS * FPS;

const ClipView: React.FC<{ clip: Clip }> = ({ clip }) => {
  const frame = useCurrentFrame(); // relativo al inicio de la Sequence
  const { fps } = useVideoConfig();

  const impact = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  const scale = clip.impact ? interpolate(impact, [0, 1], [1.1, 1]) : 1;

  return (
    <OffthreadVideo
      src={staticFile(clip.file)}
      trimBefore={Math.round(clip.from * fps)}
      trimAfter={Math.round(clip.to * fps)}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale})`,
      }}
    />
  );
};

const EndText: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: 60 }}
    >
      <h1
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1.1,
          textAlign: "center",
          color: "white",
          textShadow: "0px 0px 20px #FF00FF",
          transform: `translateY(${interpolate(frame, [0, 20], [100, 0], { extrapolateRight: "clamp" })}px)`,
          opacity: interpolate(frame, [0, 10], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        APROVECHA 15% DE DESCUENTO
        <br />
        EN TIENDA POSITIVERIFE
      </h1>
    </AbsoluteFill>
  );
};

export const FashionReel: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {CLIPS.map((clip, i) => {
        const from = cursor;
        const duration = clipFrames(clip);
        cursor += duration;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <ClipView clip={clip} />
          </Sequence>
        );
      })}
      <Sequence from={cursor} durationInFrames={END_TEXT_SECONDS * FPS}>
        <EndText />
      </Sequence>
    </AbsoluteFill>
  );
};
