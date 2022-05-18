export enum fieldType {
  text = 0,
  number = 1,
  dateTime = 2,
  count = 98,
  price = 99,
}

export class field {
  name: string;
  type: fieldType;
  i18n: string;
  click: Function | null;
  constructor(
    name: string,
    type: fieldType = fieldType.text,
    i18n: string | null = null,
    click: Function | null = null
  ) {
    this.name = name;
    this.type = type;
    this.i18n = i18n ?? "instrument." + name;
    this.click = click;
  }
}

export default {
  fieldType,
  field,
};
