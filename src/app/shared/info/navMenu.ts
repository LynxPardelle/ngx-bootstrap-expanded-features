import { INavMenu } from '../interfaces/naveMenu';

export const navMenu: INavMenu[] = [
  {
    url: '/about',
    title: 'About',
    sections: [
      {
        url: '/guide/basic',
        title: 'Basics',
        fragment: 'basicHTU',
      },
      {
        url: '/guide/colors',
        title: 'Colors',
      },
      {
        url: '/guide/breakpoints',
        title: 'BreakPoints',
      },
    ],
  },
  {
    url: '/guide/background',
    title: 'Background',
    sections: [
      {
        url: '/guide/background',
        title: 'Hover',
        fragment: 'hoverBGHTU',
      },
      {
        url: '/guide/background',
        title: 'Active',
        fragment: 'activeBGHTU',
      },
    ],
  },
  {
    url: '/guide/border',
    title: 'Border',
    fragment: 'borderHTU',
    sections: [
      {
        url: '/guide/border',
        title: 'Width',
        fragment: 'widthborderHTU',
      },
      {
        url: '/guide/border',
        title: 'Style',
        fragment: 'styleborderHTU',
      },
      {
        url: '/guide/border',
        title: 'Color',
        fragment: 'colorborderHTU',
      },
      {
        url: '/guide/border',
        title: 'Radius',
        fragment: 'radiusborderHTU',
      },
    ],
  },
  {
    url: '/guide/button',
    title: 'Buttons',
    fragment: 'buttonHTU',
    sections: [
      {
        url: '/guide/button',
        title: 'Normal Button',
        fragment: 'normalbuttonHTU',
      },
      {
        url: '/guide/button',
        title: 'Outline Button',
        fragment: 'outlinebuttonHTU',
      },
    ],
  },
  {
    url: '/guide/opacity',
    title: 'Opacity',
  },
  {
    url: '/guide/position',
    title: 'Position',
    fragment: 'positionHTU',
  },
  {
    url: '/guide/shadows',
    title: 'Shadows',
    fragment: 'shadowsHTU',
  },
  {
    url: '/guide/sizing',
    title: 'Sizing',
    fragment: 'sizingHTU',
    sections: [
      {
        url: '/guide/sizing',
        title: 'Width & Height',
        fragment: 'wnhsizeHTU',
      },
      {
        url: '/guide/sizing',
        title: 'Min & Max Width & Height',
        fragment: 'wmnwmxhmnnhmxsizeHTU',
      },
      {
        url: '/guide/sizing',
        title: 'Padding & Margin',
        fragment: 'pnmsizeHTU',
      },
      {
        url: '/guide/sizing',
        title: 'Gap',
        fragment: 'gapsizeHTU',
      },
    ],
  },
  {
    url: '/guide/text',
    title: 'Text',
    fragment: 'textHTU',
    sections: [
      {
        url: '/guide/text',
        title: 'Hover Text Color',
        fragment: 'hoverTextHTU',
      },
      {
        url: '/guide/text',
        title: 'Active Text Color',
        fragment: 'activeTextHTU',
      },
      {
        url: '/guide/text',
        title: 'Link Color',
        fragment: 'linkHTU',
      },
      {
        url: '/guide/text',
        title: 'Link Hover Color',
        fragment: 'hoverLinkHTU',
      },
      {
        url: '/guide/text',
        title: 'Link Active Color',
        fragment: 'activeLinkHTU',
      },
      {
        url: '/guide/text',
        title: 'Font Size',
        fragment: 'fssizeHTU',
      },
      {
        url: '/guide/text',
        title: 'Line Height',
        fragment: 'lhsizeHTU',
      },
    ],
  },
  {
    url: '/guide/z-index',
    title: 'Z-Index',
    fragment: 'zindexHTU',
  },
  {
    url: '/guide/advanced',
    title: 'Advanced',
    sections: [
      {
        url: '/guide/pseudos',
        title: 'Pseudo Classes & Pseudo Elements',
      },
      {
        url: '/guide/reserved-words',
        title: 'Reserved Words',
      },
      {
        url: '/guide/combinators',
        title: 'CSS Combinators',
      },
      {
        url: '/guide/abbreviations',
        title: 'Value Abbreviations and Class Abbreviations',
      },
      {
        url: '/guide/combos',
        title: 'Combos',
      },
      {
        url: '/guide/methods',
        title: 'Methods',
      },
    ],
  },
];
