export interface INavMenu {
  url: string;
  title: string;
  fragment?: string;
  sections?: INavMenu[];
}
