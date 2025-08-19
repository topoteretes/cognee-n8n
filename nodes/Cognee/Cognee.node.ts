import {
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';

export class Cognee implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Cognee',
    name: 'cognee',
    icon: 'file:cognee.svg',
    group: ['transform'],
    version: 1,
    description: 'Add text data to a Cognee dataset, or trigger cognify to build a knowledge graph from added data, or run a search query on data in Cognee memory',
    defaults: {
      name: 'Add Data (Cognee)',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'cogneeApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials.baseUrl}}',
      headers: {
        Accept: 'application/json',
        'X-Api-Key': '={{$credentials.apiKey}}',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Add Data', value: 'addData' },
          { name: 'Cognify', value: 'cognify' },
          { name: 'Search', value: 'search' },
        ],
        default: 'addData',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['addData'],
          },
        },
        options: [
          {
            name: 'Add',
            value: 'add',
            action: 'Add text to a cognee dataset',
            description: 'Add text_data to a Cognee dataset to "cognify" later in the Cognee memory engine',
            routing: {
              request: {
                method: 'POST',
                url: '/api/add',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            },
          },
        ],
        default: 'add',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['cognify'],
          },
        },
        options: [
          {
            name: 'Cognify',
            value: 'cognify',
            action: 'Cognify an existing dataset to save in memory',
            description: 'After adding text data to a Cognee dataset, trigger cognify to build a knowledge graph based memory from it',
            routing: {
              request: {
                method: 'POST',
                url: '/api/cognify',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            },
          },
        ],
        default: 'cognify',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['search'],
          },
        },
        options: [
          {
            name: 'Search',
            value: 'search',
            action: 'Search in cognee memory',
            description: 'Run a search query in Cognee memory engine',
            routing: {
              request: {
                method: 'POST',
                url: '/api/search',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            },
          },
        ],
        default: 'search',
      },
      // Add action fields
      {
        displayName: 'Dataset Name',
        name: 'datasetName',
        type: 'string',
        default: '',
        required: true,
        description: 'Name of the cognee dataset that textData will be added to',
        displayOptions: {
          show: {
            resource: ['addData'],
            operation: ['add'],
          },
        },
        routing: {
          request: {
            body: {
              datasetName: '={{$value}}',
            },
          },
        },
      },
      {
        displayName: 'Text Data',
        name: 'textData',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        required: true,
        description: 'The text content to store in the cognee dataset',
        displayOptions: {
          show: {
            resource: ['addData'],
            operation: ['add'],
          },
        },
        routing: {
          request: {
            body: {
              text_data: '={{$value}}',
            },
          },
        },
      },
      // Cognify action fields
      {
        displayName: 'Datasets',
        name: 'datasets',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        required: true,
        description: 'One or more Cognee dataset names to Cognify',
        displayOptions: {
          show: {
            resource: ['cognify'],
            operation: ['cognify'],
          },
        },
        routing: {
          request: {
            body: {
              datasets: '={{$value}}',
            },
          },
        },
      },
      {
        displayName: 'Run in Background',
        name: 'runInBackground',
        type: 'boolean',
        default: false,
        description: 'Whether to run in background without waiting for completion (fire-and-forget)',
        displayOptions: {
          show: {
            resource: ['cognify'],
            operation: ['cognify'],
          },
        },
        routing: {
          request: {
            body: {
              run_in_background: '={{$value}}',
            },
          },
        },
      },
      // Search action fields
      {
        displayName: 'Search Type',
        name: 'searchType',
        type: 'options',
        options: [
          { name: 'GraphCompletion', value: 'GRAPH_COMPLETION' },
          { name: 'ChainOfThought', value: 'GRAPH_COMPLETION_COT' },
          { name: 'RagCompletion', value: 'RAG_COMPLETION' },
        ],
        default: 'GRAPH_COMPLETION',
        description: 'Selection of search types to query the cognee memory engine',
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search'],
          },
        },
        routing: {
          request: {
            body: {
              searchType: '={{$value}}',
            },
          },
        },
      },
      {
        displayName: 'Datasets',
        name: 'datasets',
        type: 'string',
        typeOptions: {
          multipleValues: true,
        },
        default: [],
        required: true,
        description: 'Datasets to search in the cognee memory engine',
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search'],
          },
        },
        routing: {
          request: {
            body: {
              datasets: '={{$value}}',
            },
          },
        },
      },
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        required: true,
        description: 'The text query to search for',
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search'],
          },
        },
        routing: {
          request: {
            body: {
              query: '={{$value}}',
            },
          },
        },
      },
      {
        displayName: 'Top K',
        name: 'topK',
        type: 'number',
        default: 10,
        description: 'Number of elements to retrieve during context creation',
        displayOptions: {
          show: {
            resource: ['search'],
            operation: ['search'],
          },
        },
        routing: {
          request: {
            body: {
              topK: '={{$value}}',
            },
          },
        },
      },
    ],
  };
}
