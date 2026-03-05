import type {
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class Cognee implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Cognee',
    name: 'cognee',
    icon: 'file:cognee.svg',
    group: ['transform'],
    version: 1,
    description: 'Add text data to a Cognee dataset, trigger cognify to build a knowledge graph, search Cognee memory, or delete datasets and data',
    defaults: {
      name: 'Cognee',
    },
    inputs: ['main'],
    outputs: ['main'],
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
          { name: 'Delete', value: 'delete' },
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
            action: 'Add data to cognee datasets',
            description: 'Add text_data to a Cognee dataset to "cognify" later in the Cognee memory engine',
            routing: {
              request: {
                method: 'POST',
                url: '/add_text',
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
            action: 'Cognify an existing dataset into memory',
            description: 'After adding text data to a Cognee dataset, trigger cognify to build a knowledge graph based memory from it',
            routing: {
              request: {
                method: 'POST',
                url: '/cognify',
                headers: {
                  'Content-Type': 'application/json',
                },
                timeout: 1200000, // 20 minutes
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
                url: '/search',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            },
          },
        ],
        default: 'search',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['delete'],
          },
        },
        options: [
          {
            name: 'Delete Dataset',
            value: 'deleteDataset',
            action: 'Delete a dataset by its ID',
            description: 'Permanently delete a dataset and all its associated data',
            routing: {
              request: {
                method: 'DELETE',
                url: '=/datasets/{{$parameter["datasetId"]}}',
              },
              output: {
                postReceive: [
                  {
                    type: 'set',
                    properties: {
                      value: '={{ { "deleted": true } }}',
                    },
                  },
                ],
              },
            },
          },
          {
            name: 'Delete Data',
            value: 'deleteData',
            action: 'Delete a specific data item from a dataset',
            description: 'Remove a specific data item from a dataset while keeping the dataset intact',
            routing: {
              request: {
                method: 'DELETE',
                url: '=/datasets/{{$parameter["datasetId"]}}/data/{{$parameter["dataId"]}}',
              },
              output: {
                postReceive: [
                  {
                    type: 'set',
                    properties: {
                      value: '={{ { "deleted": true } }}',
                    },
                  },
                ],
              },
            },
          },
        ],
        default: 'deleteDataset',
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
              textData: '={{$value}}',
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
      // Delete action fields
      {
        displayName: 'Dataset ID',
        name: 'datasetId',
        type: 'string',
        default: '',
        required: true,
        description: 'The unique identifier (UUID) of the dataset',
        displayOptions: {
          show: {
            resource: ['delete'],
          },
        },
      },
      {
        displayName: 'Data ID',
        name: 'dataId',
        type: 'string',
        default: '',
        required: true,
        description: 'The unique identifier (UUID) of the data item to delete',
        displayOptions: {
          show: {
            resource: ['delete'],
            operation: ['deleteData'],
          },
        },
      },
    ],
  };
}
