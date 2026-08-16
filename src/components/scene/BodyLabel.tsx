import { Html } from '@react-three/drei';

interface BodyLabelProps {
  name: string;
  yOffset: number;
  active: boolean;
  dotSize?: number;
  fontSize?: number;
}

/** The small floating name tag used by every clickable body (planets, Moon, probes, generic markers). */
export function BodyLabel({ name, yOffset, active, dotSize = 5, fontSize = 11 }: BodyLabelProps) {
  return (
    <Html position={[0, yOffset, 0]} center style={{ pointerEvents: 'none' }} occlude={false} zIndexRange={[10, 0]}>
      <div
        className="font-mono"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize,
          whiteSpace: 'nowrap',
          color: active ? '#00f0ff' : 'rgba(240,244,248,0.55)',
          textShadow: active ? '0 0 8px rgba(0,240,255,0.8)' : 'none',
          transition: 'color 0.2s',
          letterSpacing: 0.4,
        }}
      >
        <span
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: 'currentColor',
            boxShadow: '0 0 6px currentColor',
          }}
        />
        {name}
      </div>
    </Html>
  );
}
