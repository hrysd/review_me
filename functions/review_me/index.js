'use strict';

import axios    from 'axios';
import lambda   from 'apex.js';
import octonode from 'octonode';

const GITHUB_TOKEN     = process.env.GITHUB_TOKEN;
const IDOBATA_HOOK_URL = process.env.IDOBATA_HOOK_URL;
const REPOSITORIES     = process.env.REPOSITORIES;
const TARGET_RABELS    = process.env.TARGET_RABELS;

const labels = TARGET_RABELS.split(',');
const client = octonode.client(GITHUB_TOKEN);

const repositories = REPOSITORIES.split(',').map((repository) => {
  return labeledIssues(client.repo(repository), labels);
});

function labeledIssues(repo, labels) {
  return new Promise((resolve, reject) => {
    const a = repo.issues({labels: labels, state: 'open'}, function(err, issues) {
      if (err) { return resolve(''); }

      let text = `### ${repo.name}\n\n`;

      text += issues.map((issue) => {
        const imgTag = `<img src='${issue.user.avatar_url}' width='16' height='16'/>`;

        return `- [${[issue.title]}](${issue.html_url}) by ${imgTag} __${issue.user.login}__`;
      }).join('\n');

      resolve(text);
    });
  });
}

export default lambda((e, ctx) => {
  return new Promise((resolve, reject) => {
    Promise.all(repositories).then((data) => {
      let text = '## (゛、゜) ＜ レビューしてくれ〜〜〜 \n\n';

      text += data.join('\n\n');

      axios.post(
        IDOBATA_HOOK_URL,
        {
          source: text,
          format: 'markdown'
        }
      ).then(() => {
        resolve('success');
      }).catch(() => {
        reject('Fail to post');
      });
    });
  });
});
