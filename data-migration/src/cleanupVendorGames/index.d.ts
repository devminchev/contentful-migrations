import { Environment } from "contentful-management";


export interface ScriptParams {
  accessToken: string;
  env: Environment;
  vendor: string;
}

export function script(params: ScriptParams): Promise<void>;
