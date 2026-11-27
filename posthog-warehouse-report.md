# PostHog Data Warehouse Setup Report

Created 0 of 2 detected sources in PostHog. The credential prompts were cancelled, so both sources need browser setup.

## Changes made

- No application source code or configuration was changed.
- No warehouse source was created in PostHog.
- Added this report with browser setup links for the detected Clerk and Expo sources.

## Files created

- `posthog-warehouse-report.md`

## Manual steps

1. Connect **Clerk** in PostHog: [Open Clerk source setup](https://us.i.posthog.com/project/770943/data-warehouse/new-source?kind=Clerk&utm_source=wizard&utm_campaign=warehouse-source). Use a production Clerk secret key beginning with `sk_live_`; the test key supplied earlier is not accepted by this connector.
2. Connect **Expo (EAS)** in PostHog: [Open Expo source setup](https://us.i.posthog.com/project/770943/data-warehouse/new-source?kind=Expo&utm_source=wizard&utm_campaign=warehouse-source). Enter an Expo personal or robot access token and the EAS project ID.
