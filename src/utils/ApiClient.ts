import {
  AuthMiddlewareOptions,
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { API_URL, AUTH_URL, CLIENT_ID, CLIENT_SECRET, PROJECT_KEY, SCOPES } from './apiClientData';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

class ApiClient {
  private httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: API_URL,
    fetch,
  };
  private options: AuthMiddlewareOptions = {
    host: AUTH_URL,
    projectKey: PROJECT_KEY,
    credentials: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    },
    scopes: SCOPES.split(' '),
    fetch,
  };
  private ctpClient: Client = new ClientBuilder()
    .withClientCredentialsFlow(this.options)
    .withHttpMiddleware(this.httpMiddlewareOptions)
    // .withLoggerMiddleware() // Include middleware for logging
    .build();

  public apiRoot: ByProjectKeyRequestBuilder;
  constructor() {
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({ projectKey: PROJECT_KEY });
  }

  public updatePassFlow(email: string, password: string): void {
    const options: PasswordAuthMiddlewareOptions = {
      host: AUTH_URL,
      projectKey: PROJECT_KEY,
      credentials: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        user: {
          username: email,
          password: password,
        },
      },
      scopes: SCOPES.split(' '),
      fetch,
    };

    const passFlowCtpClient = new ClientBuilder()
      .withPasswordFlow(options)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      // .withLoggerMiddleware() // Include middleware for logging
      .build();

    this.apiRoot = createApiBuilderFromCtpClient(passFlowCtpClient).withProjectKey({ projectKey: PROJECT_KEY });
    console.log('apiRoot updated!!!!!!');
  }
  public updateClientCredentialsFlow(): void {
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({ projectKey: PROJECT_KEY });
    console.log('apiRoot updated!!!!!!');
  }
}

export const apiClient = new ApiClient();
