const Alert = require('../models/Alert');

const RULES = [
  {
    key: 'fuel_low',
    type: 'warning',
    message: 'Niveau de carburant faible (moins de 20%).',
    check: (v) => v.fuel < 20,
  },
  {
    key: 'battery_low',
    type: 'warning',
    message: 'Niveau de batterie faible (moins de 15%).',
    check: (v) => v.battery < 15,
  },
  {
    key: 'unlocked',
    type: 'intrusion',
    message: 'Le véhicule est actuellement déverrouillé.',
    check: (v) => v.lock === 'unlocked',
  },
  {
    key: 'service_soon',
    type: 'info',
    message: 'Entretien prévu dans moins de 15 jours.',
    check: (v) => {
      if (!v.nextService) return false;
      const diff = (new Date(v.nextService) - new Date()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 15;
    },
  },
];

async function applyRules(userId, vehicles) {
  for (const vehicle of vehicles) {
    for (const rule of RULES) {
      const triggered = rule.check(vehicle);

      const existing = await Alert.findOne({
        userId,
        vehicleId: vehicle._id,
        ruleKey: rule.key,
        status: 'active',
      });

      if (triggered && !existing) {
        await Alert.create({
          userId,
          vehicleId: vehicle._id,
          ruleKey: rule.key,
          type: rule.type,
          message: `${vehicle.name} — ${rule.message}`,
        });
      }

      if (!triggered && existing) {
        await existing.deleteOne();
      }
    }
  }
}

module.exports = { applyRules };
