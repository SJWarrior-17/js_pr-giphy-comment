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
    const giphyApiKey = core.getInput('giphy-api-token');

    const octokit = new Octokit({ auth: githubToken });
    const giphy = Giphy(giphyApiKey);

    const { owner, repo, number: issue_number } = github.context.issue;

    const response = await giphy.random('thank you');

    const gifUrl = response?.data?.images?.downsized?.url;

    if (!gifUrl) {
      throw new Error(
        `No GIF URL found: ${JSON.stringify(response)}`
      );
    }

    console.log(`GIPHY_URL - ${gifUrl}`);

    const commentBody = `### 🎉 Thanks for contributing!

![Giphy GIF](${gifUrl})`;

    console.log(commentBody);

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body: commentBody
    });

    core.setOutput('comment-url', gifUrl);

    console.log(`Giphy GIF comment added successfully! ${gifUrl}`);

  } catch (error) {
    core.setFailed(error.message);
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
```

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
