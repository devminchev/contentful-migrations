export interface FunctionParams {
  accessToken: string;
  env: string;
  space: string;
}

export default function (params: FunctionParams): Promise<void>;
