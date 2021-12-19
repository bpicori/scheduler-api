import child_process from 'child_process';
import path from 'path';
import axios from 'axios';
import config from 'config';

export const sleep = (time: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, time * 1000);
  });
};

const waitForHealthCheck = async (): Promise<void> => {
  const steps = 10;
  for (let i = 0; i < steps; i++) {
    try {
      await axios.get(`${config.get('e2e.api_url')}/status`);
      console.log('Timer Server is Running');
      return;
    } catch (e) {
      if (e instanceof Error) {
        console.log('Health check failed ', e.message);
      }
      await sleep(2);
    }
  }
  console.log('Child process not ready after 100 steps!');
};

const spawnInProcessPath = async (
  projectPath: string,
  env: Record<string, string | undefined> = {},
  logs = false,
): Promise<child_process.ChildProcess> => {
  const process_path = path.join(__dirname, '../../..', projectPath);
  return child_process.fork(process_path, {
    env,
    stdio: logs ? 'inherit' : 'ignore',
  });
};

export const spawnBackendServer = async (
  logs = false,
): Promise<Array<child_process.ChildProcess>> => {
  const pr = await spawnInProcessPath('/dist/main.js', process.env, logs);
  console.log('Child Process starting!');
  await waitForHealthCheck();
  console.log('Child process ready!');
  return [pr];
};
