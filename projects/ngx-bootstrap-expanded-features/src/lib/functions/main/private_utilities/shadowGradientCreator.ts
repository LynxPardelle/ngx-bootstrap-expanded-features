import { console_log } from '../../console_log';

export const shadowGradientCreator = async (
  shadow: string,
  onlyGradient: boolean = false
): Promise<string> => {
  let hOffset: string = `0`;
  let vOffset: string = `0`;
  let blur: string = `5`;
  let spread: string = `5`;
  let color: string = `black`;
  let inset: boolean = false;
  if (!onlyGradient) {
    let numericalValuesRegex: RegExp =
      /(?<![\(#]+)^(inset)?(\s?-?[0-9\.]+(?:(px)|(cm)|(mm)|(pt)|(in)|(pc)|(r?em)|(vmin)|(vh)|(vm(ax)?)|(%)|(vw))?\s?){2,4}/g;
    const numericalValuesMatches = shadow.match(numericalValuesRegex);
    console_log.consoleLog('info', {
      numericalValuesMatches: numericalValuesMatches,
    });
    if (!!numericalValuesMatches) {
      color = shadow.replace(numericalValuesRegex, '');
      console_log.consoleLog('info', {
        shadowColor: color,
      });
      let numericalValuesSplit: string[] = shadow.replace(color, '').split(' ');
      if (numericalValuesSplit[0] === 'inset') {
        inset = true;
        numericalValuesSplit.shift();
      }
      if (numericalValuesSplit[0] === '') {
        numericalValuesSplit.shift();
      }
      hOffset = numericalValuesSplit[0] || '0';
      vOffset = numericalValuesSplit[1] || '0';
      blur = numericalValuesSplit[3] || '0';
      spread = numericalValuesSplit[2] || '5';
    }
  } else {
    color = shadow;
  }
  return `content:" ";border-radius:inherit;position:absolute;inset:-${spread};transform:translate3d(${hOffset},${vOffset},-1);background:${color};filter:blur(${blur});clip-path: polygon(-100vmax -100vmax,100vmax -100vmax,100vmax 100vmax,-100vmax 100vmax,-100vmax -100vmax,calc(0px  + ${spread} - ${hOffset}) calc(0px  + ${spread} - ${vOffset}),calc(0px  + ${spread} - ${hOffset}) calc(100% - ${spread} - ${vOffset}),calc(100% - ${spread} - ${hOffset}) calc(100% - ${spread} - ${vOffset}),calc(100% - ${spread} - ${hOffset}) calc(0px  + ${spread} - ${vOffset}),calc(0px  + ${spread} - ${hOffset}) calc(0px  + ${spread} - ${vOffset})`;
};
