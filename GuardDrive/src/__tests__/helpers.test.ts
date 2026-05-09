import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  tireWearColor,
  pressureColor,
  fuelColor,
  batteryColor,
  fmtDate,
  daysUntil,
  weatherEmoji,
  labelAlertType,
} from '../utils/helpers';

describe('tireWearColor', () => {
  it('returns red when wear is below 30%', () => {
    expect(tireWearColor(0)).toBe('#e57373');
    expect(tireWearColor(29)).toBe('#e57373');
  });

  it('returns orange when wear is between 30% and 59%', () => {
    expect(tireWearColor(30)).toBe('#fbbf24');
    expect(tireWearColor(59)).toBe('#fbbf24');
  });

  it('returns green when wear is 60% or above', () => {
    expect(tireWearColor(60)).toBe('#81c784');
    expect(tireWearColor(100)).toBe('#81c784');
  });
});

describe('pressureColor', () => {
  it('returns red when pressure is dangerously low (< 1.8 bar)', () => {
    expect(pressureColor(1.5)).toBe('#e57373');
    expect(pressureColor(1.79)).toBe('#e57373');
  });

  it('returns red when pressure is dangerously high (> 3.2 bar)', () => {
    expect(pressureColor(3.3)).toBe('#e57373');
    expect(pressureColor(4.0)).toBe('#e57373');
  });

  it('returns orange when pressure is slightly low (1.8–1.99 bar)', () => {
    expect(pressureColor(1.8)).toBe('#fbbf24');
    expect(pressureColor(1.99)).toBe('#fbbf24');
  });

  it('returns orange when pressure is slightly high (2.81–3.2 bar)', () => {
    expect(pressureColor(2.9)).toBe('#fbbf24');
    expect(pressureColor(3.2)).toBe('#fbbf24');
  });

  it('returns green when pressure is in the normal range (2.0–2.8 bar)', () => {
    expect(pressureColor(2.0)).toBe('#81c784');
    expect(pressureColor(2.5)).toBe('#81c784');
    expect(pressureColor(2.8)).toBe('#81c784');
  });
});

describe('fuelColor', () => {
  it('returns red when fuel is below 20%', () => {
    expect(fuelColor(0)).toBe('#e57373');
    expect(fuelColor(19)).toBe('#e57373');
  });

  it('returns orange when fuel is between 20% and 39%', () => {
    expect(fuelColor(20)).toBe('#fbbf24');
    expect(fuelColor(39)).toBe('#fbbf24');
  });

  it('returns green when fuel is 40% or above', () => {
    expect(fuelColor(40)).toBe('#81c784');
    expect(fuelColor(100)).toBe('#81c784');
  });
});

describe('batteryColor', () => {
  it('returns red when battery is below 20%', () => {
    expect(batteryColor(0)).toBe('#e57373');
    expect(batteryColor(19)).toBe('#e57373');
  });

  it('returns orange when battery is between 20% and 49%', () => {
    expect(batteryColor(20)).toBe('#fbbf24');
    expect(batteryColor(49)).toBe('#fbbf24');
  });

  it('returns green when battery is 50% or above', () => {
    expect(batteryColor(50)).toBe('#81c784');
    expect(batteryColor(100)).toBe('#81c784');
  });
});

describe('fmtDate', () => {
  it('returns "—" for empty string', () => {
    expect(fmtDate('')).toBe('—');
  });

  it('formats a valid ISO date in French locale', () => {
    const result = fmtDate('2025-01-15');
    expect(result).toContain('2025');
    expect(result).toContain('15');
  });

  it('returns the raw string if the date is invalid', () => {
    expect(fmtDate('not-a-date')).toBe('not-a-date');
  });
});

describe('daysUntil', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for empty string', () => {
    expect(daysUntil('')).toBeNull();
  });

  it('returns a positive number for a future date', () => {
    expect(daysUntil('2025-06-10')).toBe(9);
  });

  it('returns 0 for today', () => {
    expect(daysUntil('2025-06-01')).toBe(0);
  });

  it('returns a negative number for a past date', () => {
    expect(daysUntil('2025-05-25')).toBe(-7);
  });
});

describe('weatherEmoji', () => {
  it('returns sun for clear sky (code 0)', () => {
    expect(weatherEmoji(0)).toBe('☀️');
  });

  it('returns partly cloudy for codes 1–2', () => {
    expect(weatherEmoji(1)).toBe('🌤️');
    expect(weatherEmoji(2)).toBe('🌤️');
  });

  it('returns cloudy for code 3', () => {
    expect(weatherEmoji(3)).toBe('☁️');
  });

  it('returns fog for codes 4–48', () => {
    expect(weatherEmoji(10)).toBe('🌫️');
    expect(weatherEmoji(48)).toBe('🌫️');
  });

  it('returns rain for codes 49–67', () => {
    expect(weatherEmoji(61)).toBe('🌧️');
  });

  it('returns snow for codes 68–77', () => {
    expect(weatherEmoji(71)).toBe('❄️');
  });

  it('returns rain shower for codes 78–82', () => {
    expect(weatherEmoji(80)).toBe('🌦️');
  });

  it('returns thunderstorm for codes 83–99', () => {
    expect(weatherEmoji(95)).toBe('⛈️');
  });

  it('returns thermometer for out-of-range codes', () => {
    expect(weatherEmoji(100)).toBe('🌡️');
  });
});

describe('labelAlertType', () => {
  it('labels warning alerts', () => {
    expect(labelAlertType('warning')).toBe('Avertissement');
  });

  it('labels intrusion alerts', () => {
    expect(labelAlertType('intrusion')).toBe('Intrusion');
  });

  it('labels info alerts (and unknown types) as Info', () => {
    expect(labelAlertType('info')).toBe('Info');
    expect(labelAlertType('unknown')).toBe('Info');
  });
});
