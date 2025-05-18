const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
if (!discordWebhookUrl) {
  throw new Error('DISCORD_WEBHOOK_URL is not set');
}

module.exports = async ({ github, context }) => {
  const { data } = await github.rest.actions.listJobsForWorkflowRun({
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: context.payload.workflow_run.id,
    per_page: 100,
  });

  const hasFailed = data.jobs.some((j) => j.conclusion === 'failure');
  const response = await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `chattun deploy ${hasFailed ? 'failure' : 'success'}`,
      username: 'chattun bot',
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to send notification: ${response.statusText}`);
  }
  console.log('Notification sent successfully');
};
