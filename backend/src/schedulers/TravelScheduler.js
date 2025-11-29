const cron = require('node-cron');
const mongoose = require('mongoose');

const Travel = mongoose.model('Travel');

class TravelScheduler {
  static start() {
    console.log('Starting travel scheduler...');

    // Verifica cada hora si hay viajes RESERVED vencidos (TTL 48h) para liberar stock
    cron.schedule('0 * * * *', async () => {
      try {
        const now = new Date();
        const candidates = await Travel.find({
          status: 'RESERVED',
          ttlReleaseAt: { $lte: now },
        })
          .select('_id startDate reservedAt ttlReleaseAt')
          .lean();

        if (candidates.length > 0) {
          console.log(`[TravelScheduler] Found ${candidates.length} reserved travel(s) past TTL. Manual review required.`);
        }
      } catch (error) {
        console.error('[TravelScheduler] Error checking TTL for travels:', error);
      }
    });

    console.log('Travel scheduler started successfully');
  }
}

module.exports = TravelScheduler;


