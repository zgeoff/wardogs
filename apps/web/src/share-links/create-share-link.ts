import { createServerFn } from '@tanstack/react-start';
import { writeSharedPlan } from '@wardogs-love/fob-share';
import { z } from 'zod';
import { getShareDatabase } from './get-share-database';

// stores a plan's share code on the server and returns its short share id
export const createShareLink = createServerFn({ method: 'POST' })
  .validator(z.string().min(1))
  .handler(async (context) => {
    const database = await getShareDatabase();

    return writeSharedPlan(database, context.data);
  });
