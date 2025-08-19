import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class CogneeApi implements ICredentialType {
  name = 'cogneeApi';
  displayName = 'Cognee API';
  documentationUrl = 'https://api.cognee.ai/docs/';

  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://cognee--cognee-saas-backend-serve.modal.run',
      placeholder: 'https://api.cognee.ai',
      description:
        'The root URL of Cognee API instance.',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description:
        'Your Cognee API key, sent in the `X-Api-Key` header for authentication.',
    },
  ];
}
