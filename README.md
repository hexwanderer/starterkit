# Starterkit for React with TRPC

This is a starterkit for React with TRPC. It includes a bunch of features that you can use to build your own app. The example app is a simple resource management SaaS app -- you can use it as a starting point for your own project.

## Features

- Authentication with [Better Auth](https://github.com/BetterAuth/better-auth)
- Authorization with [ABAC](https://en.wikipedia.org/wiki/Attribute-based_access_control)
- Database with [Drizzle ORM](https://drizzle-orm.com/)
- Teams and resources management
- User management
- Organization management
- Queues with [BullMQ](https://docs.bullmq.io/)
- Analytics with [PostHog](https://posthog.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) 20.x or higher
- [Bun](https://bun.sh/) 1.x or higher
- A [PostgreSQL](https://www.postgresql.org/) database
- A [Redis](https://redis.io/) server
- A [PostHog](https://posthog.com/) account

We recommend using [Neon](https://neon.tech/) for your PostgreSQL database, and [Upstash](https://upstash.com/) for your Redis server. Both have generous free tiers that should be sufficient, at least for development purposes.