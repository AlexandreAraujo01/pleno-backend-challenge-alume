import { config } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { afterAll, beforeAll } from 'vitest';
import { PrismaClient } from '../prisma/generated/prisma';
import { envSchema } from '../env';

config({ path: '.env', override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;
  process.env.NODE_ENV = 'test';

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
