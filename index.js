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

