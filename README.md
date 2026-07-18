https://kodekloud.com/public-playgrounds/multi-node-k8s-1-34

```
sudo apt update
sudo apt install nodejs
sudo apt install npm
node --version
npm --version
```
Alternative
```
sudo apt update && \
sudo apt install -y curl && \
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash - && \
sudo apt install -y nodejs
```

Steps: 
```
mkdir js-actions
```
```
cd js-actions
```

Ref: https://docs.github.com/en/actions/tutorials/create-actions/create-a-javascript-action
Ref: https://notes.kodekloud.com/docs/GitHub-Actions/Introduction/Introducing-Github-Actions/page

```
npm init -y
```

```
vi action.yaml
```

```
name: 'Giphy PR Comments'
description: 'Add a Giphy GIG Comment to new pull request'
inputs:
  github-token:
    description: 'GitHub Token'
    required: true
  giphy-api-token:
    description: 'Giphy API Token'
    required: true

runs:
  using: node24
  main: dist/index.js

```

```
vi index.js
```

```
const { Octokit } = require('@octokit/rest');
const Giphy = require('giphy-api');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const githubToken = core.getInput('github-token');
    const giphyApiKey = core.getInput('giphy-api-key');
    
    const octokit = new Octokit({ auth: githubToken });
    const giphy = Giphy(giphyApiKey);

    const context = github.context;
    const { owner, repo, number } = context.issue; 
    
    const prComment = await giphy.random('thank you');

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: `### PR - ${number} ### 🎉 Thanks for contributing!\n![Giphy](${prComment.data.images.downsized.url})`
    });

    core.setOutput('comment-url', '${prComment.data.images.downsized.url}');
    console.log('Giphy GIF comment added successfully! Comment URL: ${prComment.data.images.downsized.url}')
  } catch (error) {
    core.setFailed(error.message);
    process.exit(1);
  }
}
run();
```

### Install them with npm
```
 npm install \
  @actions/core@1.11.1 \
  @actions/github@6.0.1 \
  @octokit/rest@21 \
  giphy-api@2.0.2
```

Bundle your application need use NCC(Bundle with Vercel NCC)

### The latest version of @vercel/ncc is 0.44.1
```
npm install --save-dev @vercel/ncc@0.44.1
```

###  install the latest available version:

```
npm install --save-dev @vercel/ncc@latest
``

### To reduce file size and avoid committing node_modules, bundle your code into a single file
```
ncc build index.js -o dist
```

or

```
npx ncc build index.js -o dist
```

```
vi .gitignore
```
node_modules

---

## Publishing Action on GitHub Action Marketplace

Ref: https://docs.github.com/en/actions/how-tos/create-and-publish-actions/publish-in-github-marketplace
Ref: https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax#inputs