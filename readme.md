# audioform

Extract waveform data from audio files in NodeJS.

Implementing [CSS-Tricks: Making an Audio Waveform Visualizer with Vanilla JavaScript](https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/).

Using [`web-audio-api`](https://github.com/audiojs/web-audio-api).

## Install

```bash
npm install audioform
# or yarn add audioform
```

## Usage

```typescript
import { readFile } from 'fs/promises';
import audioToWaveformData, { Options } from 'audioform';

const options: Options = {
  samples: 70 // default
  channel: 0  // default
}
const buffer: Buffer = await readFile('./myAudio.mp3');
const waveformData: number[] = await audioToWaveformData(buffer, options)

console.log(waveformData)
```

## License

> The MIT License
>
> Copyright (C) 2022 Musicube GmbH
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
> of the Software, and to permit persons to whom the Software is furnished to do
> so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
> IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
