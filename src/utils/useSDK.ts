// import { ctpClient } from './BuildClient';
import { ClientResponse, ProductPagedQueryResponse, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ctpClient } from './BuildClient';
import { projectKey } from './apiClientData';
// import { projectKey } from './clientData';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: `${projectKey}` });

// Example call to return list of products
// This code has the same effect as sending a GET request to the commercetools Composable Commerce API without any endpoints.
const getProject: () => Promise<ClientResponse<ProductPagedQueryResponse>> = () => {
  return apiRoot.products().get().execute();
};

// Retrieve Project information and output the result to the log
getProject().then(console.log).catch(console.error);
