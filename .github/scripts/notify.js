const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
if (!discordWebhookUrl) {
  throw new Error('DISCORD_WEBHOOK_URL is not set');
}

module.exports = async ({ github, context }) => {
  const { owner, repo } = context.repo;

  const { data: jobsData } = await github.rest.actions.listJobsForWorkflowRun({
    owner: owner,
    repo: repo,
    run_id: context.workflow_run.id,
    per_page: 100,
  });

  const hasFailed = jobsData.jobs.some((j) => j.conclusion === 'failure');
  if (hasFailed) {
    await notify('failure');
  } else {
    await notify('success');
  }
};

async function notify(status) {
  const body = {
    content: `chattun deploy ${status}`,
    username: 'chattun bot',
  };
  const response = await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to send notification: ${response.statusText}`);
  }
  console.log('Notification sent successfully');
}
