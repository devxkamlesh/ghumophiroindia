/**
 * Background Workers — STUBBED
 * These workers require tables (locations, distances, tour_destinations, location_summary)
 * that are not yet in the database. They will be enabled once those tables are created.
 */

import logger from '../core/logger'

export async function startScheduledJobs(): Promise<void> {
  logger.info('[workers] Background workers disabled — new DB tables not yet created')
}

export default { startScheduledJobs }
