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

    const prComment = await giphy.random('thank you');

    // Print the full response so you can verify the response structure
    console.log(JSON.stringify(prComment, null, 2));

    const gifUrl =
      prComment?.data?.image_url ??
      prComment?.data?.images?.downsized?.url;

    if (!gifUrl) {
      throw new Error('No GIF URL found in the Giphy response.');
    }

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body: `### 🎉 Thanks for contributing!

![Giphy](${gifUrl})`
    });

    core.setOutput('comment-url', gifUrl);
    console.log(`Giphy GIF comment added successfully! Comment URL: ${gifUrl}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

