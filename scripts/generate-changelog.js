const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const changelogPath = path.join(__dirname, '../packages/doc/docs/versions/changelog.md');

const types = {
  feat: 'Features',
  fix: 'Bug Fixes',
  docs: 'Documentation',
  doc: 'Documentation',
  style: 'Styles',
  refactor: 'Code Refactoring',
  perf: 'Performance Improvements',
  test: 'Tests',
  build: 'Build System',
  ci: 'Continuous Integration',
  chore: 'Chores',
  revert: 'Reverts',
  release: 'Releases',
  deploy: 'Deployments',
};

const tagRegex = /^v(\d+\.\d+\.\d+)$/;
const commitRegex = /^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/;

function getTags() {
  const output = execSync('git tag -l --sort=-v:refname', { encoding: 'utf8' }).trim();
  return output.split('\n').filter(t => t.match(tagRegex));
}

function getCommits(from, to) {
  const range = from ? `${from}..${to}` : to;
  const output = execSync(`git log ${range} --format="%H%n%s%n%ci%n------------------------" --no-merges`, { encoding: 'utf8' });
  const blocks = output.split('------------------------').filter(b => b.trim());
  
  return blocks.map(block => {
    const lines = block.trim().split('\n');
    const hash = lines[0].trim();
    const subject = lines[1].trim();
    const date = lines[2].trim();
    
    const match = subject.match(commitRegex);
    if (match) {
      return {
        hash,
        type: match[1],
        scope: match[2] || '',
        subject: match[3],
        date: new Date(date),
      };
    }
    return null;
  }).filter(Boolean);
}

function generateChangelog() {
  const tags = getTags();
  const unreleasedCommits = tags.length > 0 ? getCommits(tags[0], 'HEAD') : getCommits(null, 'HEAD');
  
  const releases = [];
  
  if (unreleasedCommits.length > 0) {
    releases.push({
      version: 'Unreleased',
      date: new Date(),
      commits: unreleasedCommits,
    });
  }
  
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const prevTag = tags[i + 1];
    const commits = getCommits(prevTag, tag);
    
    if (commits.length > 0) {
      const dateOutput = execSync(`git log -1 --format="%ci" ${tag}`, { encoding: 'utf8' }).trim();
      releases.push({
        version: tag.replace('v', ''),
        date: new Date(dateOutput),
        commits,
      });
    }
  }
  
  let changelog = '';
  
  releases.forEach(release => {
    const dateStr = release.date.toISOString().split('T')[0];
    changelog += `# ${release.version} (${dateStr})\n\n`;
    
    const grouped = {};
    release.commits.forEach(commit => {
      const section = types[commit.type];
      if (!section) return;
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(commit);
    });
    
    Object.keys(grouped).sort().forEach(section => {
      changelog += `### ${section}\n\n`;
      grouped[section].forEach(commit => {
        const shortHash = commit.hash.substring(0, 7);
        const scopeStr = commit.scope ? `**${commit.scope}:** ` : '';
        changelog += `* ${scopeStr}${commit.subject} ([${shortHash}](https://github.com/HeQingHua2018/plugin-flow-engine/commit/${commit.hash}))\n`;
      });
      changelog += '\n';
    });
  });
  
  fs.writeFileSync(changelogPath, changelog.trim() + '\n');
  console.log('Changelog generated successfully!');
}

generateChangelog();
