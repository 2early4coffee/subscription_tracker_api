export const generateEmailTemplate = ({
                                          userName,
                                          subscriptionName,
                                          renewalDate,
                                          planName,
                                          price,
                                          paymentMethod,
                                          accountSettingsLink,
                                          supportLink,
                                          daysLeft,
                                      }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subscriptionName} Renewal Reminder</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #4F46E5; padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Subscription Reminder</h1>
            <p style="color: #C7D2FE; margin: 8px 0 0 0;">Your subscription renews in <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'}</strong></p>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
            <p style="color: #374151; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
            <p style="color: #374151; font-size: 16px;">
                This is a friendly reminder that your <strong>${subscriptionName}</strong> subscription is due for renewal on <strong>${renewalDate}</strong>.
            </p>

            <!-- Subscription Details -->
            <div style="background-color: #F9FAFB; border-radius: 8px; padding: 24px; margin: 24px 0;">
                <h2 style="color: #111827; font-size: 18px; margin: 0 0 16px 0;">Subscription Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Plan</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${planName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB;">Price</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #E5E7EB;">$${price}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB;">Renewal Date</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #E5E7EB;">${renewalDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB;">Payment Method</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right; border-top: 1px solid #E5E7EB;">${paymentMethod}</td>
                    </tr>
                </table>
            </div>

            <p style="color: #374151; font-size: 16px;">
                Please ensure your payment details are up to date to avoid any interruption to your service.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="${accountSettingsLink}" style="background-color: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600;">
                    Manage Subscription
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px; margin: 0;">
                Need help? <a href="${supportLink}" style="color: #4F46E5; text-decoration: none;">Contact Support</a>
            </p>
            <p style="color: #9CA3AF; font-size: 12px; margin: 8px 0 0 0;">
                You're receiving this email because you have an active subscription in your account.
            </p>
        </div>

    </div>
</body>
</html>
`;

export const emailTemplates = [
    {
        label: 'Reminder 7 days before',
        subject: (name) => `Your ${name} subscription renews in 7 days`,
        generateBody: (params) => generateEmailTemplate({ ...params, daysLeft: 7 }),
    },
    {
        label: 'Reminder 5 days before',
        subject: (name) => `Your ${name} subscription renews in 5 days`,
        generateBody: (params) => generateEmailTemplate({ ...params, daysLeft: 5 }),
    },
    {
        label: 'Reminder 2 days before',
        subject: (name) => `Your ${name} subscription renews in 2 days`,
        generateBody: (params) => generateEmailTemplate({ ...params, daysLeft: 2 }),
    },
    {
        label: 'Reminder 1 day before',
        subject: (name) => `Your ${name} subscription renews tomorrow`,
        generateBody: (params) => generateEmailTemplate({ ...params, daysLeft: 1 }),
    },
];