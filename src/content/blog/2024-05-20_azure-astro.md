---
title: "Deploy Astro to Azure Static WebApps"
description: "Hate sizing storage? I sure do. Give this a shot to build out a purpose built place to do and do some testing."
pubDate: "2024-05-20 13:25:00 -0400"
heroImage: "/post_img/2024-5-20-az-astro/hero.png"
badge: "Azure"
tags: ["Storage", "NetApp", "ANF"]
---

## Brushing off the dust and trying something new!


```yaml
name: Deploy web app to Azure Static Web Apps
on:
  push:
    branches: [ "main" ]
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [ "main" ]

# Environment variables available to all jobs and steps in this workflow
env:
  APP_LOCATION: "/dist" # location of your client code
  # API_LOCATION: "api" # location of your api source code - optional
  APP_ARTIFACT_LOCATION: "dist" # location of client code build output
  OUTPUT_LOCATION: "dist" # location of client code build output
  AZURE_STATIC_WEB_APPS_API_TOKEN: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_PROUD_POND_089D2030F }} # secret containing deployment token for your static web app

permissions:
  contents: read

jobs:
  build_and_deploy_job:
    permissions:
      contents: read # for actions/checkout to fetch code
      pull-requests: write # for Azure/static-web-apps-deploy to comment on PRs
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - uses: pnpm/action-setup@v4
        name: Setup pnpm
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install
      - name: Build Site
        run: pnpm run build
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ env.AZURE_STATIC_WEB_APPS_API_TOKEN}} # secret containing api token for app
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match you app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: ${{ env.APP_LOCATION }}
          # api_location: ${{ env.API_LOCATION }}
          skip_app_build: true
          skip_api_build: true
          app_artifact_location: ${{ env.APP_ARTIFACT_LOCATION }}
          output_location: ${{ env.OUTPUT_LOCATION }}
          ###### End of Repository/Build Configurations ######

  close_pull_request_job:
    permissions:
      contents: none
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ env.AZURE_STATIC_WEB_APPS_API_TOKEN }} # secret containing api token for app
          action: "close"
```