export interface PlayerButtonProps {
  taleId?: number;
  onCommand?: (cmd: string) => void;
  onSeek?: (ms: number) => void;
  isPlaying?: boolean;
}