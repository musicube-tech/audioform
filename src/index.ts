import { AudioContext } from 'web-audio-api';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { spawn } from 'child_process';
import { write, file } from 'tempy';
import fs from 'fs/promises';

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

export function decodeAudio(
  buffer: Buffer,
  mayConvert: boolean = true,
): Promise<AudioBuffer> {
  const context: IAudioContext = new AudioContext();
  return new Promise<AudioBuffer>((resolve, reject) => {
    context.decodeAudioData(buffer, resolve, (err) => {
      if (mayConvert) {
        tryConvert(buffer).then(resolve, reject);
      } else {
        reject(err);
      }
    });
  });
}

async function tryConvert(buffer: Buffer): Promise<AudioBuffer> {
  let f: string;
  let o: string;

  try {
    o = file({ extension: 'mp3' });
    f = await write(buffer);

    const ffmpeg = spawn(ffmpegPath, [
      '-i',
      f,
      '-vn',
      '-ar',
      '44100',
      '-ac',
      '2',
      '-b:a',
      '192k',
      o,
    ]);
    await new Promise((resolve, reject) => {
      ffmpeg.on('error', reject);
      ffmpeg.on('exit', resolve);
    });
    var out = decodeAudio(await fs.readFile(o), false);
  } finally {
    await Promise.all(
      [f!, o!].map(
        (t) =>
          new Promise<void>((resolve) => {
            if (t) {
              fs.unlink(t).then(resolve, resolve);
            } else {
              resolve();
            }
          }),
      ),
    );
  }

  return out;
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
