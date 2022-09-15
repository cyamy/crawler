import fs from 'fs-extra';
import yaml from 'js-yaml';

export type Targets = {
  title: string;
  local: string;
  stage: string;
};

type loadFile = {
  targets: Targets[];
  deviceList: string[];
};
const data = yaml.load(fs.readFileSync('targets.yaml', 'utf-8')) as loadFile;

export const deviceList = data.deviceList;
export const targets = data.targets;
