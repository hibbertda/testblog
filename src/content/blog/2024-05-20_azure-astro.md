---
title: "Deploy Astro to Azure Static WebApps"
description: "Brushing off the dust and trying something new with the Blog"
pubDate: "2024-05-20 13:25:00 -0400"
heroImage: "/post_img/2024-5-20-az-astro/hero.png"
badge: "Blog"
tags: ["Azure", "Astro", "Static WebApp"]
author: "Daniel the Expert"
---

## Brushing off the dust and trying something new!

I'm still on the hunt for the perfect place to call home for my website and blog! I started out with a paid account on WordPress.com, but then I discovered Jekyll and GitHub Pages - and let me tell you, they were okay, but not exactly what I was looking for. They got the job done, but left me feeling like there's still more to explore. So, my search continues...

Getting ready for round three, I stumbled upon [Astro](https://astro.build/) during my search. Astro is a static site generator that's not only easier to use but also packed with more features than the ones I've tried before. To spice things up, I'm hosting it all on an [Azure Static WebApps](https://learn.microsoft.com/en-us/azure/static-web-apps/overview). This setup offers a robust, low-cost (or potentially no-cost) platform and takes care of details like SSL certificates for me.

## Building the blog

The Astro documentation is extensive and covers all you would need to know to get things up and running. With most of the heavy lifting for me was done for me by using the [Astrofy](https://github.com/manuelernestog/astrofy) theme which includes pretty much everything I needed to quickly get up and running. 

## Deploying the blog

The blog is set up, all my articles are updated and moved over, and everything is packaged up and pushed into a GitHub repo. Next up is setting up GitHub Actions to deploy everything to the Static Web App. I started with a base example Action and needed to make two small changes to overcome a few hurdles.

### Create Static WebApp

Follow the instructions on deploying a Static WebApp. I went the easy route of using the [Azure Extension for vscode](https://learn.microsoft.com/en-us/azure/static-web-apps/getting-started?tabs=vanilla-javascript). This will take care of creating the resource and a getting starter Action setup with deployment credentials ready to go.

### Github Actions

#### Node Version

The default version of node deployed from Actions was not compatible with Astro. This is called out in their documentation with a quick fix by updating the _package.json_ with a compatible version of Node. 

```json
  "engines": {
    "node": ">=18.0.0"
  },
```

#### PNPM tasks

Going back to how the Astrofy theme did most of the heavy lifting, it included using **pnpm** for building and other tasks. So, I removed all the default _npm_ tasks and swapped them with _pnpm_.

```yaml
  - uses: pnpm/action-setup@v4
    name: Setup pnpm
    with:
      version: 8
  - name: Install dependencies
    run: pnpm install
  - name: Build Site
    run: pnpm run build
```

#### Full github action:

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