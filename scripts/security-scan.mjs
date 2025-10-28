import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const reportsDir = resolve('docs', 'qa');
if (!existsSync(reportsDir)) {
  mkdirSync(reportsDir, { recursive: true });
}

function runCommand(command) {
  try {
    const output = execSync(command, { stdio: 'pipe' }).toString();
    return { success: true, output };
  } catch (error) {
    return { success: false, output: error.stdout?.toString() ?? error.message };
  }
}

const checks = [
  {
    name: 'Dependency vulnerability scan',
    command: 'npx --yes npm-check-updates --doctor'
  },
  {
    name: 'Secret exposure scan',
    command: 'npx --yes trufflehog filesystem --no-update /home/engine/project'
  },
  {
    name: 'ESLint security rules',
    command: 'npx eslint --config eslint.config.js --ext .ts,.tsx src'
  }
];

const results = checks.map((check) => {
  const result = runCommand(check.command);
  return {
    name: check.name,
    command: check.command,
    success: result.success,
    output: result.output
  };
});

const reportContent = `# Security Testing Report\n\n${results
  .map(
    (result) => `## ${result.name}\n- Command: \`${result.command}\`\n- Success: ${result.success ? '✅' : '❌'}\n\n\`\`\`\n${result.output}\n\`\`\``
  )
  .join('\n\n')}\n`;

writeFileSync(resolve(reportsDir, 'security-report.md'), reportContent);

console.log('Security report generated at docs/qa/security-report.md');
