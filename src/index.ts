import { AudioContext } from 'web-audio-api';

export interface AudioBuffer {
  getChannelData(channel: number): number[];
}
export interface Options {
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
  { channel = 0, samples }: Options = {},
): Promise<number[]> {
  const audioBuffer = await decodeAudio(buffer);
  const data = audioBuffer.getChannelData(channel);
  return normalizeData(filteredData(data, samples));
}

export function decodeAudio(buffer: Buffer): Promise<AudioBuffer> {
  const context: IAudioContext = new AudioContext();
  return new Promise<AudioBuffer>((resolve, reject) => {
    context.decodeAudioData(buffer, resolve, reject);
  });
}

export function filteredData(
  rawData: number[],
  samples: number = 70,
): number[] {
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

export function getMultiplier(data: number[]) {
  return Math.pow(Math.max(...data), -1);
}

export function normalizeData(
  filteredData: number[],
  multiplier = getMultiplier(filteredData),
): number[] {
  return filteredData.map((n) => n * multiplier);
}
