## Setup of base

```shell
npm init -y

npm install fastify @fastify/swagger @fastify/swagger-ui @fastify/view @fastify/static ejs

npm install @fastify/cookie

npm install dotenv jsonwebtoken @fastify/jwt bcrypt drizzle-orm pg pg-native

npm install -D typescript ts-node nodemon @types/node @types/bcrypt @types/jsonwebtoken @types/dotenv @types/ejs @types/pg
```

## Initialize TypeScript
```shell
npx tsc --init
```

## Install and Initialize Drizzle config
```shell
npm install drizzle-orm
npm install -D drizzle-kit

npx drizzle-kit init
```

## Pino prettifier for logging
```shell
npm install pino-pretty --save-dev
```

## Application structure
```shell
app_starter/
│── app/
│   ├── app.ts
│   ├── server.ts
│   ├── plugins/
│   │   ├── swagger.ts
│   │   ├── ejs.ts
│   │   ├── drizzle.ts
│   │   └── jwt.ts
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.route.ts
│   │       ├── auth.service.ts
│   │       └── auth.schema.ts
│   ├── db/
│   │   ├── schema.ts
│   │   └── drizzle.config.ts
│   └── utils/hash.ts
│
├── views/
│   └── index.ejs
│
├── package.json
├── .env
└── tsconfig.json
```

## Hosting
PM2 Cluster Mode - Recommended to Production
```shell
npm install -g pm2
```

# Database Migrations
Generate the migrations
```shell
npx drizzle-kit generate --config=./app/drizzle.config.ts
```