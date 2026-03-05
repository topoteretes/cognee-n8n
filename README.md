# n8n-nodes-cognee

Use Cognee Cloud's AI memory and context engineering directly in your n8n workflows.

This community node lets you:

- Add text data to a Cognee dataset
- Turn data into AI memory with cognify to build knowledge-graph-based memory
- Run search over your AI memory datasets
- Delete datasets or individual data items

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

## Table of contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Operations](#operations)
- [Usage examples](#usage-examples)
- [Compatibility](#compatibility)
- [Resources](#resources)
- [Version history](#version-history)
- [License](#license)

## Installation

Install from within n8n:

1. In n8n, go to Settings → Community Nodes
2. Click Install and search for `n8n-nodes-cognee`, or paste the package name directly
3. Confirm the installation

Or install in your n8n instance directory:

```bash
npm install n8n-nodes-cognee
```

Restart n8n after installation if required.

## Credentials

Get your Cognee API key and Base URL from your [Cognee Cloud dashboard](https://docs.cognee.ai/how-to-guides/cognee-cloud) (API Keys page).

Create credentials of type `Cognee API` in n8n. The node uses these values to authenticate every request:

- **Base URL**: The base URL of your Cognee Cloud instance, e.g. `https://tenant-xxx.cloud.cognee.ai/api`.
- **API Key**: Your Cognee API key, sent via the `X-Api-Key` header.

## Operations

The node exposes four resources. Each operation maps to a Cognee API endpoint.

### Resource: Add Data

- **Operation**: Add
- **Endpoint**: `POST /add_text`
- **Fields**:
  - Dataset Name (`datasetName`, required): Name of the Cognee dataset to add text to
  - Text Data (`textData`, required, multiple): Array of strings to store

Example body sent by the node:

```json
{
  "datasetName": "support_docs",
  "textData": [
    "FAQ: Reset password via account settings.",
    "Guide: Export data as CSV from dashboard."
  ]
}
```

### Resource: Cognify

- **Operation**: Cognify
- **Endpoint**: `POST /cognify`
- **Fields**:
  - Datasets (`datasets`, required, multiple): One or more dataset names to cognify

Example body sent by the node:

```json
{
  "datasets": ["support_docs"]
}
```

### Resource: Search

- **Operation**: Search
- **Endpoint**: `POST /search`
- **Fields**:
  - Search Type (`searchType`): One of `GRAPH_COMPLETION`, `GRAPH_COMPLETION_COT`, `RAG_COMPLETION`
  - Datasets (`datasets`, required, multiple)
  - Query (`query`, required)
  - Top K (`topK`, optional number): Defaults to 10

Example body sent by the node:

```json
{
  "searchType": "GRAPH_COMPLETION",
  "datasets": ["support_docs"],
  "query": "How do I export my data?",
  "topK": 5
}
```

### Resource: Delete

- **Operation**: Delete Dataset
- **Endpoint**: `DELETE /datasets/{datasetId}`
- **Fields**:
  - Dataset ID (`datasetId`, required): The UUID of the dataset to delete

- **Operation**: Delete Data
- **Endpoint**: `DELETE /datasets/{datasetId}/data/{dataId}`
- **Fields**:
  - Dataset ID (`datasetId`, required): The UUID of the dataset
  - Data ID (`dataId`, required): The UUID of the data item to remove

## Usage examples

End-to-end example workflow:

1. **Add Data** (Cognee)
   - Resource: Add Data → Operation: Add
   - Dataset Name: `support_docs`
   - Text Data: Add one or more strings with your content
2. **Cognify** (Cognee)
   - Resource: Cognify → Operation: Cognify
   - Datasets: `support_docs`
3. **Search** (Cognee)
   - Resource: Search → Operation: Search
   - Search Type: `GRAPH_COMPLETION`
   - Datasets: `support_docs`
   - Query: Your question, e.g. "How do I export my data?"
   - Top K: `5`
4. **Delete** (Cognee)
   - Resource: Delete → Operation: Delete Dataset
   - Dataset ID: UUID of the dataset to remove

Troubleshooting:

- 401/403 errors: Check the API key and that `X-Api-Key` is accepted by your Cognee instance.
- Connection errors: Verify Base URL and network access from your n8n host.

## Compatibility

- Node.js: >= 20.15
- n8n Nodes API: v1

The node depends on `n8n-workflow` at runtime (peer dependency). It should work on current n8n releases supporting community nodes.

## Resources

- [Cognee Cloud docs](https://docs.cognee.ai/how-to-guides/cognee-cloud)
- [Package homepage](https://github.com/topoteretes/cognee-n8n)

## Version history

- **0.2.0**: Add Delete resource (Delete Dataset, Delete Data operations). Update API endpoints and base URL to Cognee Cloud.
- **0.1.0**: Initial release with Add Data, Cognify, and Search operations.

## License

MIT
