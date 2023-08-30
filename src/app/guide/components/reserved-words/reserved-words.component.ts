import { Component, OnInit } from '@angular/core';
import { NgxBootstrapExpandedFeaturesService as BefService } from 'ngx-bootstrap-expanded-features';

@Component({
  selector: 'app-reserved-words',
  templateUrl: './reserved-words.component.html',
  styleUrls: ['./reserved-words.component.scss'],
})
export class ReservedWordsComponent implements OnInit {
  public reservedWords: {
    reservedWord: string;
    description: string;
    example?: string;
  }[] = [
    {
      reservedWord: '"per":"%"',
      description:
        'The percentage symbol is used to indicate that the value is a percentage.',
      example: 'bef-text-50per = width: 50%',
    },
    {
      reservedWord: '"COM":" , "',
      description:
        'The comma symbol is used to indicate that you want to add a comma.',
      example:
        'bef-boxShadow-0__2px__4px__lavenderCOMinset__2px__0__4px__fairy = box-shadow: 0 2px 4px #D6BCFF , inset 2px 0 4px #D680FF',
    },
    {
      reservedWord: '"CSP":"\'"',
      description:
        'The single quote symbol is used to indicate that you want to add a single quote.',
      example: "bef-text-CSPHello WorldCSP = content: 'Hello World'",
    },
    {
      reservedWord: '"CDB":"""',
      description:
        'The double quote symbol is used to indicate that you want to add a double quote.',
      example: 'bef-text-CDBHello WorldCDB = content: "Hello World"',
    },
    {
      reservedWord: '"MIN":"-"',
      description:
        'The minus symbol is used to indicate that you want a "-" symbol.',
      example: 'bef-text-MIN50px = width: -50px',
    },
    {
      reservedWord: '"PLUS":"+"',
      description:
        'The plus symbol is used to indicate that you want a "+" symbol.',
      example: 'bef-w-SD50px__PLUS__10vwED = width: calc(50px + 10vw)',
    },
    {
      reservedWord: '"SD":"("',
      description:
        'The open parenthesis symbol is used to indicate that you want to add an open parenthesis.',
      example: 'bef-w-SD50px__PLUS__10vwED = width: calc(50px + 10vw)',
    },
    {
      reservedWord: '"ED":")"',
      description:
        'The close parenthesis symbol is used to indicate that you want to add a close parenthesis.',
      example: 'bef-w-SD50px__PLUS__10vwED = width: calc(50px + 10vw)',
    },
    {
      reservedWord: '"SE":"["',
      description:
        'The open square bracket symbol is used to indicate that you want to add an open square bracket.',
      example: `bef-wSEL__COMaSEtargetEQCDBUNDblankCDBEE-50px = .bef-wSELCOM__aSEtargetEQCDBUNDblankCDBEE-50px, a[target="_blank"] { width: 50px}]`,
    },
    {
      reservedWord: '"EE":"]"',
      description:
        'The close square bracket symbol is used to indicate that you want to add a close square bracket.',
      example: `bef-wSEL__COMaSEtargetEQCDBUNDblankCDBEE-50px = .bef-wSELCOM__aSEtargetEQCDBUNDblankCDBEE-50px, a[target="_blank"] { width: 50px}]`,
    },
    {
      reservedWord: '"HASH":"#"',
      description:
        'The hash symbol is used to indicate that you want to add a hash symbol.',
      example: `bef-text-HASHFF0000 = color: #FF0000`,
    },
    {
      reservedWord: '"SLASH":"/"',
      description:
        'The slash symbol is used to indicate that you want to add a slash symbol.',
      example: `bef-wSEL__COMaSEtargetEQCDBUNDblankCDBEE-50px = .bef-wSELCOM__aSEhrefEQCDBhttpsDPSSLASHSLASHlynxpardelle_comCDBEE-50px, a[href="https://lynxpardelle.com"] { width: 50px}]`,
    },
    {
      reservedWord: '"UND":"_"',
      description:
        'The underscore symbol is used to indicate that you want to add an underscore symbol.',
      example: `bef-wSEL__COMaSEtargetEQCDBUNDblankCDBEE-50px = .bef-wSELCOM__aSEtargetEQCDBUNDblankCDBEE-50px, a[target="_blank"] { width: 50px}]`,
    },
    {
      reservedWord: '"__":" "',
      description:
        'The double underscore symbol is used to indicate that you want to add a space.',
      example: `bef-boxShadow-0__2px__4px__lavender = box-shadow: 0 2px 4px #D6BCFF`,
    },
    {
      reservedWord: '"_":"."',
      description:
        'The underscore symbol is used to indicate that you want to add a dot.',
      example: 'bef-mt-MIN1_5rem = margin-top: -1.5rem',
    },
    {
      reservedWord: '"CHILD":" > "',
      description: `The child symbol is used to indicate that you want to add a ">" symbol, it's usually used to get the child element as a css selector.`,
      example: `bef-wSELCHILDa-50px = .bef-wSELCYHILDa-50px > a { width: 50px}`,
    },
    {
      reservedWord: '"ADJ":" + "',
      description: `The adjacent symbol is used to indicate that you want to add a "+" symbol, it's usually used to get the adjacent element as a css selector.`,
      example: `bef-wSELADJa-50px = .bef-wSELADJa-50px + a { width: 50px}`,
    },
    {
      reservedWord: '"SIBL":" ~ "',
      description: `The sibling symbol is used to indicate that you want to add a "~" symbol, it's usually used to get the sibling element as a css selector.`,
      example: `bef-wSELSIBLa-50px = .bef-wSELSIBLa-50px ~ a { width: 50px}`,
    },
    {
      reservedWord: '"ALL":"*"',
      description: `The all symbol is used to indicate that you want to add a "*" symbol, it's usually used to get all the elements as a css selector.`,
      example: `bef-wSELCOM__ALLa-50px = .bef-wSELALLa-50px, * a { width: 50px}`,
    },
    {
      reservedWord: '"EQ":"="',
      description:
        'The equal symbol is used to indicate that you want to add an equal symbol.',
      example: `bef-wSEL__COMaSEtargetEQCDBUNDblankCDBEE-50px = .bef-wSELCOM__aSEtargetEQCDBUNDblankCDBEE-50px, a[target="_blank"] { width: 50px}]`,
    },
    {
      reservedWord: '"ST":"^"',
      description: `The start symbol is used to indicate that you want to add a "^" symbol.`,
      example: `bef-wSEL__COMaSEtargetEQCDBUNDblankCDBEE-50px = .bef-wSELCOM__aSEhrefSTEQCDBhttpsCDBEE-50px, a[href^="https"] { width: 50px}]`,
    },
    {
      reservedWord: '"INC":"$"',
      description: `The include symbol is used to indicate that you want to add a "$" symbol.`,
      example: `bef-wSEL__COMaSEtargetEQCDBUNDblankCDBEE-50px = .bef-wSELCOM__aSEhrefINCEQCDBhttpsCDBEE-50px, a[href$="https"] { width: 50px}]`,
    },
    {
      reservedWord: '"DPS":":"',
      description: `The double point symbol is used to indicate that you want to add a ":" symbol.`,
      example: `bef-wSEL__COMaSEtargetEQCDBUNDblankCDBEE-50px = .bef-wSELCOM__aSEhrefEQCDBhttpsDPSSLASHSLASHlynxpardelle_comCDBEE-50px, a[href="https://lynxpardelle.com"] { width: 50px}]`,
    },
    {
      reservedWord: '"PNC":";"',
      description: `The point and comma symbol is used to indicate that you want to add a ";" symbol.`,
    },
    {
      reservedWord: '"__OPA":"OPA"',
      description: `You can use it to active a opacity mode of a color.`,
      example: `bef-bg-fairy__OPA__0_5 = background-color: rgba(214, 128, 255, 0.5)`,
    },
    {
      reservedWord: '"SEL"',
      description: `The selector symbol is used to indicate that you want to add a css selector.\nWe will see this in its proper section of the guide later.`,
      example: `bef-wSEL__COMaSEtargetEQCDBUNDblankCDBEE-50px = .bef-wSELCOM__aSEhrefEQCDBhttpsDPSSLASHSLASHlynxpardelle_comCDBEE-50px, a[href="https://lynxpardelle.com"] { width: 50px}]`,
    },
    {
      reservedWord: '"VAL","VALS","DEF"',
      description:
        'Reserved word used in the combos, we will see this in its proper section of the guide later.',
    },
  ];
  constructor(private _befService: BefService) {}

  ngOnInit(): void {
    this.cssCreate();
  }

  cssCreate() {
    this._befService.cssCreate();
  }
}
