import fs from 'fs-extra';
import yaml from 'js-yaml';

export type Targets = {
  title: string;
  local: string;
  stage: string;
};

type loadFile = {
  targets: Targets[];
};

const loadTargets = () => {
  const data = yaml.load(fs.readFileSync('targets.yaml', 'utf-8')) as loadFile;
  return data.targets;
};

export const targets = loadTargets();
