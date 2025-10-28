import postmark from 'postmark';

let client: postmark.ServerClient | null = null;

function getClient(): postmark.ServerClient | null {
  if (client) return client;

  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    console.warn('[Postmark] Server token not configured');
    return null;
  }

  client = new postmark.ServerClient(token);
  return client;
}

const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL || 'noreply@example.com';

export async function sendWelcomeEmail(email: string, username: string): Promise<{ success: boolean; error?: string }> {
  const postmarkClient = getClient();
  if (!postmarkClient) {
    return { success: false, error: 'Postmark not configured' };
  }

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: email,
      Subject: 'Welcome to Adventure Quest Platform!',
      HtmlBody: `<h1>Welcome, ${username}!</h1><p>We're excited to have you join the Adventure Quest Platform.</p>`,
      TextBody: `Welcome, ${username}! We're excited to have you join the Adventure Quest Platform.`,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendVerificationEmail(email: string, verificationUrl: string): Promise<{ success: boolean; error?: string }> {
  const postmarkClient = getClient();
  if (!postmarkClient) {
    return { success: false, error: 'Postmark not configured' };
  }

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: email,
      Subject: 'Verify Your Email Address',
      HtmlBody: `<h1>Verify Your Email</h1><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
      TextBody: `Verify your email: ${verificationUrl}`,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<{ success: boolean; error?: string }> {
  const postmarkClient = getClient();
  if (!postmarkClient) {
    return { success: false, error: 'Postmark not configured' };
  }

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: email,
      Subject: 'Reset Your Password',
      HtmlBody: `<h1>Reset Your Password</h1><p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      TextBody: `Reset your password: ${resetUrl}`,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendTierUpgradeEmail(email: string, tierName: string): Promise<{ success: boolean; error?: string }> {
  const postmarkClient = getClient();
  if (!postmarkClient) {
    return { success: false, error: 'Postmark not configured' };
  }

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: email,
      Subject: `Welcome to ${tierName} Tier!`,
      HtmlBody: `<h1>Congratulations!</h1><p>You've upgraded to the ${tierName} tier.</p>`,
      TextBody: `Congratulations! You've upgraded to the ${tierName} tier.`,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
