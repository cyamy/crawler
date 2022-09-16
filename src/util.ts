import fs from 'fs-extra';
import yaml from 'js-yaml';

export type Targets = {
  title: string;
  local: string;
  stage: string;
};

type loadFile = {
  targets: Targets[];
  emulateDevices: string[];
};
const data = yaml.load(fs.readFileSync('targets.yaml', 'utf-8')) as loadFile;

export const emulateDevices = data.emulateDevices;
export const targets = data.targets;
