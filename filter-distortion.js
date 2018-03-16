class FilterDistortion {
  constructor() {
    this.name = 'Distortion';
    this.defaultValues = {
      size: 4,
      density: 0.5,
      mix: 0.5,
    };
    this.valueRanges = {
      size: { min: 1, max: 10 },
      density: { min: 0.0, max: 1.0 },
      mix: { min: 0.0, max: 1.0 },
    };
  }

  filter(input, values = this.defaultValues) {
    const { width, height } = input;

    const inputData = input.data;
    const outputData = inputData.slice();

    let size = (values.size === undefined)
      ? this.defaultValues.size
      : parseInt(values.size, 10);
    if (size < 1) size = 1;

    const density = (values.density === undefined)
      ? this.defaultValues.density
      : Number(values.density);

    const mix = (values.mix === undefined)
      ? this.defaultValues.mix
      : Number(values.mix);

    const radius = size + 1;
    const numShapes = parseInt(((((2 * density) / 30) * width) * height) / 2, 10);

    for (let i = 0; i < numShapes; i++) {
      const sx = (Math.random() * (2 ** 32) & 0x7fffffff) % width;
      const sy = (Math.random() * (2 ** 32) & 0x7fffffff) % height;

      const rgb2 = [
        inputData[(((sy * width) + sx) * 4) + 0],
        inputData[(((sy * width) + sx) * 4) + 1],
        inputData[(((sy * width) + sx) * 4) + 2],
        inputData[(((sy * width) + sx) * 4) + 3],
      ];

      for (let x = sx - radius; x < sx + radius + 1; x++) {
        for (let y = sy - radius; y < sy + radius + 1; y++) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            const rgb1 = [
              outputData[(((y * width) + x) * 4) + 0],
              outputData[(((y * width) + x) * 4) + 1],
              outputData[(((y * width) + x) * 4) + 2],
              outputData[(((y * width) + x) * 4) + 3],
            ];
            const mixedRGB = this.mixColors(mix, rgb1, rgb2);

            for (let k = 0; k < 3; k++) {
              outputData[(((y * width) + x) * 4) + k] = mixedRGB[k];
            }
          }
        }
      }
    }

    return outputData;
  }

  linearInterpolate(t, a, b) {
    return a + (t * (b - a));
  }

  mixColors(t, rgb1, rgb2) {
    const r = this.linearInterpolate(t, rgb1[0], rgb2[0]);
    const g = this.linearInterpolate(t, rgb1[1], rgb2[1]);
    const b = this.linearInterpolate(t, rgb1[2], rgb2[2]);
    const a = this.linearInterpolate(t, rgb1[3], rgb2[3]);

    return [r, g, b, a];
  }
}
