import { AuthMiddlewareOptions, Client, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { API_URL, AUTH_URL, CLIENT_ID, CLIENT_SECRET, PROJECT_KEY, SCOPES } from './apiClientData';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { TokenResponse } from '@customTypes/types';
import { getActiveCart } from './apiRequests';

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
    .withAnonymousSessionFlow(this.options)
    .withHttpMiddleware(this.httpMiddlewareOptions)
    .build();

  public apiRoot: ByProjectKeyRequestBuilder;

  constructor() {
    const access_token = localStorage.getItem('comforto-access-token');

    this.apiRoot = access_token
      ? this.updateExistingFlow(access_token)
      : createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({ projectKey: PROJECT_KEY });
  }

  public autorize(): void {
    this.apiRoot = createApiBuilderFromCtpClient(this.ctpClient).withProjectKey({ projectKey: PROJECT_KEY });
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
        return getActiveCart();
      })
      .then((data) => {
        localStorage.setItem('comforto-cart-id', data.body.id);
      })
      .catch((err: Error) => {
        console.log(err.message);
      });
  }

  public updateClientCredentialsFlow(): void {
    const anonOptions: AuthMiddlewareOptions = {
      host: AUTH_URL,
      projectKey: PROJECT_KEY,
      credentials: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      },
      scopes: SCOPES.split(' '),
      fetch,
    };
    const anonCtpClient: Client = new ClientBuilder()
      .withAnonymousSessionFlow(anonOptions)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    this.apiRoot = createApiBuilderFromCtpClient(anonCtpClient).withProjectKey({ projectKey: PROJECT_KEY });
    localStorage.removeItem('comforto-access-token');
    this.createAnonymousToken().catch(console.log);
  }

  public createToken(): void {
    const token = localStorage.getItem('comforto-access-token');
    const refreshTokenAnonymous = localStorage.getItem('comforto-anonymous-refresh-token');

    if (token) {
      console.log('pass token');
      this.updateExistingFlow(token);
    } else if (refreshTokenAnonymous) {
      console.log('refresh anon token');
      this.refresh(refreshTokenAnonymous);
    } else {
      console.log('new anon token');
      apiClient.createAnonymousToken().catch(console.log);
    }
  }

  public async createAnonymousToken(): Promise<void> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`));

    await fetch(`${AUTH_URL}/oauth/${PROJECT_KEY}/anonymous/token?grant_type=client_credentials`, {
      method: 'POST',
      headers,
    })
      .then((res: Response) => res.json())
      .then((data: TokenResponse) => {
        localStorage.setItem('comforto-anonymous-refresh-token', data.refresh_token);
        this.refresh(data.refresh_token);
        console.log('new ano');
      })
      .catch((err: Error) => {
        console.log(err.message);
      });
  }

  private refresh(refreshToken: string): ByProjectKeyRequestBuilder {
    const options = {
      host: AUTH_URL,
      projectKey: PROJECT_KEY,
      credentials: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      },
      refreshToken,
      scopes: SCOPES.split(' '),
      fetch,
    };
    const client = new ClientBuilder()
      .withRefreshTokenFlow(options)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
    this.apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: PROJECT_KEY });
    console.log('this.refresh');
    return this.apiRoot;
  }
}

export const apiClient = new ApiClient();
