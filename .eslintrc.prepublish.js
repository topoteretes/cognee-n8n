module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	plugins: ['n8n-nodes-base'],
	extends: ['plugin:n8n-nodes-base/community'],
	parser: '@typescript-eslint/parser',
	rules: {
		// Keep default community rules; add overrides here if needed
	},
};