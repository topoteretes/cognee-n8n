# n8n-nodes-cognee

Use AI memory and context engineering, built by cognee directly in your n8n workflows.

This community node lets you:

- Add text data to a your cognee
- Turn data into AI memory with cognify to apply best context engineering practices
- Run search over your AI memory datasets

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

Get your Cognee API key from `https://platform.cognee.ai/`

Create credentials of type `Cognee API` in n8n. The node uses these values to authenticate every request:

- Base URL: The base URL of your Cognee API instance. Default in the credential form is `https://cognee--cognee-saas-backend-serve.modal.run`.
- API Key: Your Cognee API key, sent via `X-Api-Key` header.

Reference: Cognee API docs at `https://cognee--cognee-saas-backend-serve.modal.run/docs`.

## Operations

The node exposes three resources. Each operation maps to a Cognee API endpoint and request body.

### Resource: Add Data

- Operation: Add
- Endpoint: `POST /api/add`
- Fields:
  - Dataset Name (`datasetName`, required): Name of the Cognee dataset to add text to
  - Text Data (`textData`, required, multiple): Array of strings to store

Example body sent by the node:

```json
{
  "datasetName": "support_docs",
  "text_data": [
    "FAQ: Reset password via account settings.",
    "Guide: Export data as CSV from dashboard."
  ]
}
```

### Resource: Cognify

- Operation: Cognify
- Endpoint: `POST /api/cognify`
- Fields:
  - Datasets (`datasets`, required, multiple): One or more dataset names to cognify
  - Run in Background (`runInBackground`, optional boolean): If true, returns immediately

Example body sent by the node:

```json
{
  "datasets": ["support_docs"],
  "run_in_background": false
}
```

### Resource: Search

- Operation: Search
- Endpoint: `POST /api/search`
- Fields:
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

## Usage examples

End-to-end example workflow:

1. Add Data (Cognee)
   - Resource: Add Data → Operation: Add
   - Dataset Name: `support_docs`
   - Text Data: Add one or more strings with your content
2. Cognify (Cognee)
   - Resource: Cognify → Operation: Cognify
   - Datasets: `support_docs`
   - Run in Background: `false` (set `true` for fire-and-forget)
3. Search (Cognee)
   - Resource: Search → Operation: Search
   - Search Type: `GRAPH_COMPLETION`
   - Datasets: `support_docs`
   - Query: Your question, e.g. "How do I export my data?"
   - Top K: `5`

Tip: If you run Cognify in the background, add a delay or polling step before Search, depending on your dataset size.

Troubleshooting:

- 401/403 errors: Check the API key and that `X-Api-Key` is accepted by your Cognee instance.
- Connection errors: Verify Base URL and network access from your n8n host.

## Compatibility

- Node.js: >= 20.15
- n8n Nodes API: v1

The node depends on `n8n-workflow` at runtime (peer dependency). It should work on current n8n releases supporting community nodes.

## Resources

- Cognee API docs: `https://cognee--cognee-saas-backend-serve.modal.run/docs`
- Package homepage: `https://github.com/topoteretes/cognee-n8n`

## Version history

- 0.1.0: Initial release with Add Data, Cognify, and Search operations.

## License

MIT
