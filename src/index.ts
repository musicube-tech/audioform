import { AudioContext } from 'web-audio-api';

export interface AudioBuffer {
  getChannelData(channel: number): number[];
}
export interface FilteredDataOptions {
  channel?: number;
  samples?: number;
}
interface IAudioContext {
  decodeAudioData(
    buffer: Buffer,
    successCallback: (audioBuffer: AudioBuffer) => void,
    errorCallback: (error: any) => void,
  ): void;
}

export default async function audioToWaveformData(
  buffer: Buffer,
  options?: FilteredDataOptions,
): Promise<number[]> {
  return normalizeData(filteredData(await decodeAudio(buffer), options));
}

export function decodeAudio(buffer: Buffer): Promise<AudioBuffer> {
  const context: IAudioContext = new AudioContext();
  return new Promise<AudioBuffer>((resolve, reject) => {
    context.decodeAudioData(buffer, resolve, reject);
  });
}

export function filteredData(
  audioBuffer: AudioBuffer,
  { channel = 0, samples = 70 }: FilteredDataOptions = {},
): number[] {
  const rawData = audioBuffer.getChannelData(channel);
  const blockSize = Math.floor(rawData.length / samples);
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i;
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]);
    }
    filteredData.push(sum / blockSize);
  }

  return filteredData;
}

export function normalizeData(filteredData: number[]): number[] {
  const multiplier = Math.pow(Math.max(...filteredData), -1);
  return filteredData.map((n) => n * multiplier);
}
