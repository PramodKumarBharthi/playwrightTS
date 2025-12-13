import { APIRequestContext } from '@playwright/test';
import { test as base, createBdd } from 'playwright-bdd';
import { UserClient } from '../api/clients/userClient';
import { IResponse } from '../interfaces/iResponse';
import { logger as Logger } from '../utils/logger';

export class ApiWorld {
  public request: APIRequestContext;
  public userClient: UserClient;
  public response!: IResponse;
  public requestBody: any;
  public userId!: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.userClient = new UserClient(request);
  }
}

type ApiWorldFixtures = {
  apiWorld: ApiWorld;
};

export const test = base.extend<ApiWorldFixtures>({
  apiWorld: async ({ request }, use) => {
    Logger.info(`
${'='.repeat(50)}`);
    Logger.info(`🚀 Initializing API World`);
    Logger.info(`${'='.repeat(50)}
`);

    const apiWorld = new ApiWorld(request);
    await use(apiWorld);

    Logger.info(`${'='.repeat(50)}`);
    Logger.info(`✅ API World cleanup`);
    Logger.info(`${'='.repeat(50)}
`);
  },
});

export const { Given, When, Then } = createBdd(test, {
  worldFixture: 'apiWorld',
});
