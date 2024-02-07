/* Singletons */
import { ValuesSingleton } from "../../../singletons/valuesSingleton";
import { color_transform } from "../../color_transform";
const values: ValuesSingleton = ValuesSingleton.getInstance();
export const btnCreator = async (
  class2Create: string,
  specify: string,
  value: string,
  secondValue: string = "",
  outline: boolean = false
): Promise<string> => {
  return `${specify}{${outline ? "color:" + value + ";" : ""}background-color:${
    outline ? secondValue : value
  };border-color:${value};}${
    values.separator
  }.${class2Create}${specify}:hover{${
    outline && secondValue ? "color:" + secondValue + ";" : ""
  }background-color:${
    outline
      ? value
      : `rgba(${color_transform
          .shadeTintColor(color_transform.colorToRGB(value), -15)
          .toString()});border-color:rgba(${color_transform
          .shadeTintColor(color_transform.colorToRGB(value), -20)
          .toString()})`
  };}${values.separator}${
    outline
      ? ""
      : `.btn-check:focus + .${class2Create}${specify}, .${class2Create}${specify}:focus{background-color:rgba(${color_transform
          .shadeTintColor(color_transform.colorToRGB(value), -15)
          .toString()});border-color:rgba(${color_transform
          .shadeTintColor(color_transform.colorToRGB(value), -20)
          .toString()});}${values.separator}`
  }.btn-check:checked + .${class2Create}${specify}, .btn-check:active + .${class2Create}${specify}, .${class2Create}${specify}:active, .${class2Create}${specify}.active, .show > .${class2Create}${specify} .dropdown-toggle{${
    outline
      ? ""
      : `background-color:${color_transform.shadeTintColor(
          color_transform.colorToRGB(value),
          -20
        )};`
  }border-color:rgba(${color_transform
    .shadeTintColor(color_transform.colorToRGB(value), -25)
    .toString()});box-shadow: 0 0 0 0.25remrgba(${color_transform
    .shadeTintColor(color_transform.colorToRGB(value), 3)
    .toString()}, 0.5);}${
    values.separator
  }.btn-check:checked + .btn-check:focus, .btn-check:active + .${class2Create}${specify}:focus, .${class2Create}${specify}:active:focus, .${class2Create}${specify}.active:focus, .show > .${class2Create}${specify} .dropdown-toggle:focus{box-shadow: 0 0 0 0.25rem rgba(${color_transform
    .shadeTintColor(color_transform.colorToRGB(value), 3)
    .toString()}, 0.5);}`;
};
