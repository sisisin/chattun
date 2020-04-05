export type LocationSource = {
  path: string;
  params?: { [paramName: string]: string | number | boolean | undefined } | undefined;
  queryParams?: Record<string, string> | undefined;
};
export type LocationOption = {
  params?: { [paramName: string]: string | number | boolean | undefined } | undefined;
  queryParams?: Record<string, string> | undefined;
};
