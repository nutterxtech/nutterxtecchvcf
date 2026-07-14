// Vercel serverless entry point.
//
// On Replit this app runs as two separate services (see the "web" and
// "API Server" workflows). On Vercel there's no long-running server, so this
// file adapts the same Express app (from @workspace/api-server) into a
// single serverless function that handles every request under /api/*.
//
// Vercel's zero-config "Other" builder only detects Serverless Functions
// inside a top-level `api/` directory (relative to the project root), so
// this file must live at the repo root rather than nested inside the
// vcf-registration artifact.
//
// `vercel.json` rewrites `/api/:path*` to this function, and mongoose's
// connection is cached across warm invocations (see connectMongo).
/// <reference path="../artifacts/api-server/src/types/session.d.ts" />
import type { IncomingMessage, ServerResponse } from "http";
import app from "@workspace/api-server/src/app";
import { connectMongo } from "@workspace/api-server/src/lib/mongoose";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  await connectMongo();
  // Express apps are callable request handlers at runtime
  // ((req, res[, next]) => void), but depending on which @types/express
  // version gets resolved, the `Express`/`Application` type doesn't always
  // expose that call signature. Cast rather than depend on it.
  (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(
    req,
    res,
  );
}
