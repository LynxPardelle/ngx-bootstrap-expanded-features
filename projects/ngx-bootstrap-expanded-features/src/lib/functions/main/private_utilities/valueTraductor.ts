import { ValuesSingleton } from "../../../singletons/valuesSingleton";
import { abreviation_traductors } from "../../abreviation_traductors";
import { color_transform } from "./../../color_transform";
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const valueTraductor = async (
  value: string,
  property: string
): Promise<string> => {
  value = abreviation_traductors.abreviationTraductor(
    !!values.abreviationsValues[value]
      ? values.abreviationsValues[value]
      : value
  );
  if (!property.includes("content")) {
    let hasOPA: boolean = value.includes("OPA");
    if (!!hasOPA) {
      const reg = new RegExp(
        /(?:([A-z0-9#]*)|(?:(rgb)|(hsl)|(hwb))a?\([0-9\.\,\s%]*\))\s?OPA\s?0\.[0-9]*/gi
      );
      const OPAS: string[] | null = value.match(reg);
      if (!!OPAS) {
        for (let OPA of OPAS) {
          const color = OPA.split("OPA")[0];
          const OPAValue = OPA.split("OPA")[1];
          let realColor = `${color_transform
            .colorToRGB(
              !!values.colors[color.toString().replace(/\s/g, "")]
                ? values.colors[color.toString().replace(/\s/g, "")]
                : color
            )
            .toString()}`;
          value = !!OPAValue
            ? value
                .replace(color, `rgba(${realColor},${OPAValue})`)
                .replace("OPA" + OPAValue, "")
            : value;
        }
      }
    }
    // MatchForColors and ReplaceForColors
    let colors = Object.keys(values.colors)
      .sort((c1, c2) => {
        return c2.length - c1.length;
      })
      .map((c) => `(${c})`)
      .join("|");
    let reg = new RegExp("(?:" + colors + ")", "gi");
    let matches = value.match(reg);
    if (!!matches) {
      for (let match of matches) {
        let realColor: string | undefined =
          values.colors[match.replace(/\s/g, "")];
        if (!!realColor) {
          value = value.replace(
            match,
            `rgba(${color_transform.colorToRGB(realColor)})`
          );
        }
      }
    }
  }
  return value;
};
