/* Singletons */
import { ValuesSingleton } from '../singletons/valuesSingleton';
/* Funtions */
import { console_log } from './console_log';

const values: ValuesSingleton = ValuesSingleton.getInstance();
export const color_transform = {
  colorToRGB(color: string): number[] {
    try {
      let rgb: number[] = [255, 0, 0];
      color = color.toLowerCase();
      switch (true) {
        case !!values.colors[color]:
          rgb = this.colorToRGB(values.colors[color]);
          break;
        case color.includes('rgb') || color.includes('rgba'):
          rgb = this.parseRGB(color);
          break;
        case color.includes('#'):
          rgb = this.parseRGB(this.HexToRGB(color));
          break;
        case color.includes('hsl'):
          rgb = this.parseRGB(this.HSLToRGB(color));
          break;
        case color.includes('hwb'):
          rgb = this.parseRGB(this.HWBToRGB(color));
          break;
        default:
          break;
      }
      return rgb;
    } catch (error) {
      console_log.consoleLog('error', { error: error });
      return [255, 0, 0];
    }
  },
  RGBToRGBA(rgb: number[], alpha: number): string {
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
  },
  parseRGB(rgba: string): number[] {
    let rgb: number[] = [];
    if (rgba.includes('rgb') || rgba.includes('rgba')) {
      rgb = rgba.split('(')[1].split(',')[4]
        ? [
            parseInt(rgba.split('(')[1].split(',')[0]),
            parseInt(rgba.split('(')[1].split(',')[1]),
            parseInt(rgba.split('(')[1].split(',')[2]),
            parseInt(rgba.split('(')[1].split(',')[3]),
          ]
        : [
            parseInt(rgba.split('(')[1].split(',')[0]),
            parseInt(rgba.split('(')[1].split(',')[1]),
            parseInt(rgba.split('(')[1].split(',')[2]),
          ];
    }
    return rgb;
  },
  HexToRGB(Hex: string): string {
    let rgb: number[] = [];
    const hexCode = Hex.replace('#', '');
    const hexCodeLength = hexCode.length;
    if (hexCodeLength === 3) {
      rgb.push(
        parseInt(hexCode.charAt(0) + hexCode.charAt(0), 16),
        parseInt(hexCode.charAt(1) + hexCode.charAt(1), 16),
        parseInt(hexCode.charAt(2) + hexCode.charAt(2), 16)
      );
    } else if (hexCodeLength === 4) {
      rgb.push(
        parseInt(hexCode.charAt(0) + hexCode.charAt(0), 16),
        parseInt(hexCode.charAt(1) + hexCode.charAt(1), 16),
        parseInt(hexCode.charAt(2) + hexCode.charAt(2), 16),
        parseInt(hexCode.charAt(3) + hexCode.charAt(3), 16)
      );
    } else if (hexCodeLength === 6) {
      rgb.push(
        parseInt(hexCode.charAt(0) + hexCode.charAt(1), 16),
        parseInt(hexCode.charAt(2) + hexCode.charAt(3), 16),
        parseInt(hexCode.charAt(4) + hexCode.charAt(5), 16)
      );
    } else if (hexCodeLength === 8) {
      rgb.push(
        parseInt(hexCode.charAt(0) + hexCode.charAt(1), 16),
        parseInt(hexCode.charAt(2) + hexCode.charAt(3), 16),
        parseInt(hexCode.charAt(4) + hexCode.charAt(5), 16),
        parseInt(hexCode.charAt(6) + hexCode.charAt(7), 16)
      );
    } else {
      console_log.consoleLog('error', { hexToRGBError: 'Invalid hex code' });
    }
    return `rgb${![3, 6].includes(hexCodeLength) ? 'a' : ''}(${rgb.join(',')})`;
  },
  HSLToRGB(HSL: string): string {
    /* Convert hsl to rgb please */
    if (!['hsl', 'hsla'].includes(HSL)) {
      return 'rgb(255,0,0,1)';
    }
    /* Separate string by comas and eliminate rgb or rgba */
    const rgbSplited = HSL.split('(')[1]
      .split(')')[0]
      .split(',')
      .filter((r) => r !== 'hsl' && r !== 'hsla');

    const hDecimal = parseInt(rgbSplited[0]) / 100;
    const sDecimal = parseInt(rgbSplited[1]) / 100;
    const lDecimal = parseInt(rgbSplited[2]) / 100;

    if (parseInt(rgbSplited[1]) === 0) {
      return `rgb(${lDecimal},${lDecimal},${lDecimal})`;
    }
    let q =
      lDecimal < 0.5
        ? lDecimal * (1 + sDecimal)
        : lDecimal + sDecimal - lDecimal * sDecimal;
    let p = 2 * lDecimal - q;
    const r = this.HueToRGB(p, q, hDecimal + 1 / 3);
    const g = this.HueToRGB(p, q, hDecimal);
    const b = this.HueToRGB(p, q, hDecimal - 1 / 3);
    return `rgb${
      rgbSplited[3] && rgbSplited[3] !== '' ? 'a' : ''
    }(${r},${g},${b}${
      rgbSplited[3] && rgbSplited[3] !== '' ? `,${rgbSplited[3]}` : ''
    })`;
  },
  HueToRGB(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  },
  HWBToRGB(HWB: string): string {
    const rgbSplited = HWB.split('(')[1]
      .split(')')[0]
      .split(',')
      .filter((r: string) => r !== 'hsl' && r !== 'hsla');
    let h = parseInt(rgbSplited[0]) / 360;
    let wh = parseInt(rgbSplited[1]) / 100;
    let bl = parseInt(rgbSplited[2]) / 100;
    let ratio = wh + bl;
    let i;
    let v;
    let f;
    let n;

    // wh + bl cant be > 1
    if (ratio > 1) {
      wh /= ratio;
      bl /= ratio;
    }

    i = Math.floor(6 * h);
    v = 1 - bl;
    f = 6 * h - i;

    if ((i & 0x01) !== 0) {
      f = 1 - f;
    }

    n = wh + f * (v - wh); // linear interpolation

    let r;
    let g;
    let b;
    switch (i) {
      default:
      case 6:
      case 0:
        r = v;
        g = n;
        b = wh;
        break;
      case 1:
        r = n;
        g = v;
        b = wh;
        break;
      case 2:
        r = wh;
        g = v;
        b = n;
        break;
      case 3:
        r = wh;
        g = n;
        b = v;
        break;
      case 4:
        r = n;
        g = wh;
        b = v;
        break;
      case 5:
        r = v;
        g = wh;
        b = n;
        break;
    }

    return `rgb${rgbSplited[3] && rgbSplited[3] !== '' ? 'a' : ''}(${Math.round(
      r * 255
    )},${Math.round(g * 255)},${Math.round(b * 255)}${
      rgbSplited[3] && rgbSplited[3] !== '' ? `,${rgbSplited[3]}` : ''
    })`;
  },
  shadeTintColor(rgb: number[], percent: number): number[] {
    let R: any =
      rgb[0] === 0 && percent > 0
        ? 16
        : rgb[0] === 255 && percent < 0
        ? 239
        : rgb[0];
    let G: any =
      rgb[1] === 0 && percent > 0
        ? 16
        : rgb[1] === 255 && percent < 0
        ? 239
        : rgb[1];
    let B: any =
      rgb[2] === 0 && percent > 0
        ? 16
        : rgb[2] === 255 && percent < 0
        ? 239
        : rgb[2];
    R = parseInt(((R * (100 + percent)) / 100).toString());
    G = parseInt(((G * (100 + percent)) / 100).toString());
    B = parseInt(((B * (100 + percent)) / 100).toString());
    R = R > 255 ? 255 : R < 0 ? 0 : R;
    G = G > 255 ? 255 : G < 0 ? 0 : G;
    B = B > 255 ? 255 : B < 0 ? 0 : B;
    /* let RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
    let GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
    let BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16); */
    if (rgb[3]) {
      let A: any = rgb[3] ? (rgb[3] * 255).toString(16) : 'FF';
      /* let AA =
        A.toString(16).length == 1 ? '0' + A.toString(16) : A.toString(16); */
      return [R, G, B, A];
    } else {
      return [R, G, B];
    }
  },
  opacityCreator(value: string, opacity: number): string {
    if (value.includes('gradient')) {
      const colorMatches = this.separateColor4Transform(value);
      console_log.consoleLog('info', { colorMatches: colorMatches });
      if (!!colorMatches) {
        for (let colorMatch of colorMatches) {
          console_log.consoleLog('info', {
            valuePreSeparateColor4TransformPreCB: value,
          });
          value = value.replace(
            colorMatch,
            this.opacityCreator(colorMatch, opacity)
          );
          console_log.consoleLog('info', {
            valuePostSeparateColor4TransformPostCB: value,
          });
        }
        console_log.consoleLog('info', {
          valuePostSeparateColor4Transform: value,
        });
        return value;
      } else {
        return value;
      }
    } else {
      let shade3Split: number[] = this.colorToRGB(value);
      console_log.consoleLog('info', { shade3Split: shade3Split });
      console_log.consoleLog('info', { shade3SplitLength: shade3Split.length });
      if (shade3Split.length === 4) {
        shade3Split[3] = opacity;
      } else {
        shade3Split.push(opacity);
      }
      return `rgba(${shade3Split.join(',')})`;
    }
  },
  getShadeTintColorOrGradient(tintValue: number, value: string): string {
    if (value.includes('gradient')) {
      const colorMatches = this.separateColor4Transform(value);
      console_log.consoleLog('info', { colorMatches: colorMatches });
      if (!!colorMatches) {
        for (let colorMatch of colorMatches) {
          console_log.consoleLog('info', {
            valuePreSeparateColor4TransformPreCB: value,
          });
          value = value.replace(
            colorMatch,
            this.getShadeTintColorOrGradient(tintValue, colorMatch)
          );
          console_log.consoleLog('info', {
            valuePostSeparateColor4TransformPostCB: value,
          });
        }
        console_log.consoleLog('info', {
          valuePostSeparateColor4Transform: value,
        });
        return value;
      } else {
        return value;
      }
    } else {
      return `rgba(${color_transform
        .shadeTintColor(color_transform.colorToRGB(value), tintValue)
        .join(',')})`;
    }
  },
  separateColor4Transform(value: string): RegExpMatchArray | null {
    console_log.consoleLog('info', { valuePreSeparateColor4Transform: value });
    const colorReg: RegExp = new RegExp(
      /(?:(#[A-Fa-f0-9]{3,8})|(?:(rgb)|(hsl)|(hwb))a?\([0-9\.\,\s%]*\))/gi
    );
    return value.match(colorReg);
  },
};
