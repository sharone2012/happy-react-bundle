# ─────────────────────────────────────────────────────────────────────────────
# .github/workflows/price_agent.yml
# CFI Agent 6 — Fertiliser Price Agent
# Schedule: Every 15 days at 02:00 UTC (+ manual trigger)
# Repo: sharonp2012/happy-react-bundle
# ─────────────────────────────────────────────────────────────────────────────

name: CFI Price Agent — CIF Indonesia

on:
  schedule:
    # Every 15 days at 02:00 UTC (1st and 16th of each month)
    - cron: '0 2 1,16 * *'
  workflow_dispatch:
    # Manual trigger from GitHub UI (also called from Supabase Edge Function
    # when Lovable "Refresh Prices" button is clicked by user)
    inputs:
      reason:
        description: 'Reason for manual run (e.g. session-start, user-request)'
        required: false
        default: 'manual'

jobs:
  fetch-prices:
    name: Fetch CIF Indonesia Fertiliser Prices
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Price Agent
        run: node agents/price_agent.js
        env:
          ANTHROPIC_API_KEY:          ${{ secrets.ANTHROPIC_API_KEY }}
          SUPABASE_URL:               ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY:  ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

      - name: Log run summary
        if: always()
        run: echo "Price agent completed at $(date -u). Trigger=${{ github.event_name }}"
