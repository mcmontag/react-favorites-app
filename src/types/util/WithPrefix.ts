export type WithPrefix<P extends string, S extends string = string> = S &
  `${P}${string}`;
