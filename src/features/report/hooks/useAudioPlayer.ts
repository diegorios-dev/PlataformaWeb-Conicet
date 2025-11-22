import { useState } from "react";

export const useAudioPlayer = () => {
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);

  return {
    playingAudio,
    play: (id: number) => setPlayingAudio(id),
    stop: () => setPlayingAudio(null)
  };
};
