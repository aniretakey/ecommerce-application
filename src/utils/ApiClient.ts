import { AuthMiddlewareOptions, Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { API_URL, AUTH_URL, CLIENT_ID, CLIENT_SECRET, PROJECT_KEY, SCOPES } from './apiClientData';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { TokenResponse } from '@customTypes/types';

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
    .build();

  public apiRoot: ByProjectKeyRequestBuilder;

  constructor() {
    const access_token = localStorage.getItem('comforto-access-token');
    this.apiRoot = access_token
      ? this.updateExistingFlow(access_token)
      : createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({ projectKey: PROJECT_KEY });
  }

  private updateExistingFlow(access_token: string): ByProjectKeyRequestBuilder {
    interface ExistingTokenMiddlewareOptions {
      force?: boolean;
    }
    const authorization = `Bearer ${access_token}`;
    const options: ExistingTokenMiddlewareOptions = {
      force: true,
    };

    const client = new ClientBuilder()
      .withExistingTokenFlow(authorization, options)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
    this.apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });

    return this.apiRoot;
  }

  public async getNewPassFlowToken(email: string, password: string): Promise<void> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`));

    await fetch(
      `${AUTH_URL}/oauth/${PROJECT_KEY}/customers/token?grant_type=password&username=${email}&password=${password}`,
      { method: 'POST', headers },
    )
      .then((res: Response) => res.json())
      .then((data: TokenResponse) => {
        localStorage.setItem('comforto-access-token', data.access_token);
        this.updateExistingFlow(data.access_token);
      })
      .catch((err: Error) => {
        console.log(err.message);
      });
  }

  public updateClientCredentialsFlow(): void {
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({ projectKey: PROJECT_KEY });
    localStorage.removeItem('comforto-access-token');
  }
}

export const apiClient = new ApiClient();
