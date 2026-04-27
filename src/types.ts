export interface Plugin {
  id: string;
  name: string;
  description: string;
  package: string;
  binName: string;
  argsHint?: string;
}
