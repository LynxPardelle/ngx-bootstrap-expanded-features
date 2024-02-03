export const css_camel = {
  cssValidToCamel(st: string): string {
    return st.replace(/([-_][a-z])/gi, ($1) => {
      return $1.toUpperCase().replace("-", "").replace("_", "");
    });
  },
  camelToCSSValid(st: string): string {
    return st
      .replace(/[\w]([A-Z])/g, (m) => {
        return m[0] + "-" + m[1];
      })
      .toLowerCase();
  },
};
