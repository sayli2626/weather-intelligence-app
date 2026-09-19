import { PlanningInsights, RecommendationItem, ActivityGuidance } from '../types';
import { getWeatherCondition } from './weatherCodes';

export function generatePlanningInsights(
  tempCelsius: number,
  weathercode: number,
  windspeedKmh: number,
  isDay = 1
): PlanningInsights {
  const condition = getWeatherCondition(weathercode);
  const items: RecommendationItem[] = [];
  const cautions: string[] = [];
  const suitableActivities: string[] = [];

  let comfortLevel = 'Mild & Pleasant';
  let comfortSummary = 'Favorable weather conditions for everyday routines.';
  let outdoorViability: ActivityGuidance['outdoorViability'] = 'Good';
  let viabilityColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  const isFreezing = tempCelsius <= 2;
  const isCold = tempCelsius > 2 && tempCelsius <= 12;
  const isMild = tempCelsius > 12 && tempCelsius <= 19;
  const isWarm = tempCelsius > 19 && tempCelsius <= 27;
  const isHot = tempCelsius > 27;

  const isRaining = condition.category === 'rain' || condition.category === 'drizzle';
  const isSnowing = condition.category === 'snow';
  const isStormy = condition.category === 'thunderstorm';
  const isFoggy = condition.category === 'fog';
  const isWindy = windspeedKmh >= 28;
  const isSevereWind = windspeedKmh >= 45;

  // 1. CLOTHING RECOMMENDATIONS BASED ON TEMPERATURE
  if (isFreezing) {
    comfortLevel = 'Freezing Temperatures';
    comfortSummary = 'Sub-zero or near-freezing chill. Heavy thermal layering is critical.';
    items.push({
      id: 'heavy-coat',
      category: 'clothing',
      title: 'Heavy Winter Parka',
      detail: 'Down-filled or insulated cold-weather coat to lock in body heat.',
      icon: 'Shield',
      importance: 'essential',
    });
    items.push({
      id: 'winter-gear',
      category: 'accessory',
      title: 'Beanie & Insulated Gloves',
      detail: 'Protect extremities from frostbite and biting winds.',
      icon: 'Hand',
      importance: 'essential',
    });
    items.push({
      id: 'thermal-layer',
      category: 'clothing',
      title: 'Thermal Underlayer',
      detail: 'Merino wool or moisture-wicking base layers under trousers.',
      icon: 'Layers',
      importance: 'recommended',
    });
  } else if (isCold) {
    comfortLevel = 'Chilly & Brisk';
    comfortSummary = 'Cold conditions outdoors. A warm jacket and cozy layers are advised.';
    items.push({
      id: 'warm-jacket',
      category: 'clothing',
      title: 'Warm Coat or Jacket',
      detail: 'A wool overcoat, puffer jacket, or fleece-lined trench coat.',
      icon: 'Layers',
      importance: 'essential',
    });
    items.push({
      id: 'knit-sweater',
      category: 'clothing',
      title: 'Sweater or Cardigan',
      detail: 'Mid-weight knitwear for comfortable thermal regulation.',
      icon: 'Shirt',
      importance: 'recommended',
    });
    items.push({
      id: 'scarf',
      category: 'accessory',
      title: 'Light Scarf or Neckwear',
      detail: 'Helps block drafts, especially if commuting or walking outdoors.',
      icon: 'Wind',
      importance: 'optional',
    });
  } else if (isMild) {
    comfortLevel = 'Fresh & Moderate';
    comfortSummary = 'Comfortable transition weather. Flexible light layers work best.';
    items.push({
      id: 'light-jacket',
      category: 'clothing',
      title: 'Light Jacket or Windbreaker',
      detail: 'Denim, bomber jacket, or light trench you can easily remove.',
      icon: 'Layers',
      importance: 'recommended',
    });
    items.push({
      id: 'long-sleeves',
      category: 'clothing',
      title: 'Long Sleeve Shirt / Chinos',
      detail: 'Breathable long sleeves provide ideal balance for indoor & outdoor shifts.',
      icon: 'Shirt',
      importance: 'recommended',
    });
  } else if (isWarm) {
    comfortLevel = 'Warm & Comfortable';
    comfortSummary = 'Very agreeable daytime warmth. Light, breathable fabrics are ideal.';
    items.push({
      id: 'breathable-tee',
      category: 'clothing',
      title: 'Breathable Cotton / Linen',
      detail: 'Light t-shirt, linen shirt, or airy summer dress.',
      icon: 'Sun',
      importance: 'essential',
    });
    if (isDay === 1) {
      items.push({
        id: 'sunglasses',
        category: 'accessory',
        title: 'UV Sunglasses',
        detail: 'Protect your eyes from glare and direct ultraviolet rays.',
        icon: 'Glasses',
        importance: 'recommended',
      });
    }
  } else {
    // Hot
    comfortLevel = 'High Heat Alert';
    comfortSummary = 'Elevated temperatures. Stay cool, well-hydrated, and seek shade during peak sun hours.';
    items.push({
      id: 'airy-clothes',
      category: 'clothing',
      title: 'Ultra-light Loose Fabrics',
      detail: 'Moisture-wicking, light-colored garments to reflect solar heat.',
      icon: 'Sun',
      importance: 'essential',
    });
    items.push({
      id: 'sun-protection',
      category: 'accessory',
      title: 'Sun Hat & Broad Spectrum SPF',
      detail: 'Crucial for skin barrier defense against intense sunlight.',
      icon: 'ShieldAlert',
      importance: 'essential',
    });
    items.push({
      id: 'water-flask',
      category: 'accessory',
      title: 'Reusable Water Flask',
      detail: 'Maintain steady hydration throughout your day.',
      icon: 'Droplets',
      importance: 'essential',
    });
  }

  // 2. WEATHER-SPECIFIC ADVISORIES (RAIN, SNOW, STORM, WIND)
  if (isStormy) {
    comfortLevel = 'Severe Storm Warning';
    comfortSummary = 'Thunderstorms and lightning active. Minimize outdoor exposure.';
    outdoorViability = 'Stay Indoors';
    viabilityColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';

    items.unshift({
      id: 'storm-protection',
      category: 'clothing',
      title: 'Waterproof Rain Parka',
      detail: 'Opt for a hooded raincoat rather than an umbrella during lightning & gusts.',
      icon: 'Zap',
      importance: 'essential',
    });
    cautions.push('Thunder and lightning hazard: seek certified indoor shelter.');
    cautions.push('Avoid standing beneath isolated trees, towers, or open water.');
    suitableActivities.push('Indoor fitness or yoga');
    suitableActivities.push('Museum or gallery visit');
    suitableActivities.push('Cozy cafe reading or film screening');
  } else if (isRaining) {
    outdoorViability = isCold || isWindy ? 'Poor' : 'Fair';
    viabilityColor = outdoorViability === 'Poor'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : 'text-sky-400 bg-sky-500/10 border-sky-500/20';

    items.unshift({
      id: 'umbrella',
      category: 'accessory',
      title: 'Windproof Umbrella',
      detail: 'Essential to shield against steady precipitation and passing squalls.',
      icon: 'Umbrella',
      importance: 'essential',
    });
    items.push({
      id: 'waterproof-footwear',
      category: 'footwear',
      title: 'Waterproof Footwear',
      detail: 'Leather or treated boots to keep feet dry through wet sidewalks and puddles.',
      icon: 'Footprints',
      importance: 'recommended',
    });
    cautions.push('Pavements and crosswalks will be slick; allow extra transit time.');
    suitableActivities.push('Indoor shopping or culinary tours');
    suitableActivities.push('Library, bookstore, or theater');
  } else if (isSnowing) {
    outdoorViability = 'Fair';
    viabilityColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';

    items.unshift({
      id: 'snow-boots',
      category: 'footwear',
      title: 'Treaded Snow Boots',
      detail: 'Insulated boots with deep traction lugs to prevent slips on snow and ice.',
      icon: 'Footprints',
      importance: 'essential',
    });
    items.push({
      id: 'waterproof-outer',
      category: 'clothing',
      title: 'Water-Repellent Outerwear',
      detail: 'Resists moisture saturation from melting snow flurries.',
      icon: 'Shield',
      importance: 'essential',
    });
    cautions.push('Watch for black ice patches on bridges, steps, and shadowed roads.');
    suitableActivities.push('Winter photography & scenic park strolls');
    suitableActivities.push('Skiing / snowboarding if in alpine regions');
    suitableActivities.push('Cozy indoor gatherings');
  } else if (isFoggy) {
    cautions.push('Low horizontal visibility: use vehicle fog lights and stay vigilant crossing streets.');
    outdoorViability = 'Fair';
    viabilityColor = 'text-slate-300 bg-slate-500/10 border-slate-500/20';
    suitableActivities.push('Moody architectural photography');
    suitableActivities.push('Quiet park walks with reflective gear');
  }

  // 3. WIND SPEED FACTOR
  if (isSevereWind) {
    items.push({
      id: 'wind-shell',
      category: 'clothing',
      title: 'High-Density Wind Shell',
      detail: 'Blocks strong gusts that cause rapid body temperature loss.',
      icon: 'Wind',
      importance: 'essential',
    });
    cautions.push(`High wind warning (${Math.round(windspeedKmh)} km/h): Watch for falling tree debris and loose signs.`);
    if (!isStormy && outdoorViability !== 'Stay Indoors') {
      outdoorViability = 'Fair';
      viabilityColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  } else if (isWindy) {
    items.push({
      id: 'windbreaker',
      category: 'clothing',
      title: 'Wind-Resistant Layer',
      detail: 'Keeps moderate breezes from piercing standard fabrics.',
      icon: 'Wind',
      importance: 'recommended',
    });
    cautions.push('Breezy conditions: umbrellas may turn inside-out during sudden gusts.');
  }

  // 4. GENERAL OUTDOOR SUITABILITY
  if (!isStormy && !isRaining && !isSnowing) {
    if (isWarm || (isMild && !isSevereWind)) {
      outdoorViability = 'Excellent';
      viabilityColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      suitableActivities.push('Jogging, road cycling, or outdoor tennis');
      suitableActivities.push('Al fresco dining and rooftop coffee');
      suitableActivities.push('Sightseeing, walking tours, and park picnics');
    } else if (isCold && !isSevereWind) {
      outdoorViability = 'Good';
      viabilityColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      suitableActivities.push('Brisk morning walk or bundled run');
      suitableActivities.push('Outdoor farmers markets and city exploring');
    } else if (isHot) {
      outdoorViability = 'Fair';
      viabilityColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      cautions.push('High UV and heat index: schedule strenuous exercises before 10 AM or after 6 PM.');
      suitableActivities.push('Swimming or waterside leisure');
      suitableActivities.push('Air-conditioned galleries and shopping malls');
    }
  }

  return {
    comfortLevel,
    comfortSummary,
    recommendations: items.slice(0, 4), // Top 4 high-priority suggestions
    activityGuidance: {
      outdoorViability,
      viabilityColor,
      summary: isStormy
        ? 'Dangerous outdoor conditions; remain inside until the front passes.'
        : isRaining
        ? 'Damp conditions. Plan for covered transit and indoor activities.'
        : isFreezing
        ? 'Extreme cold. Limit prolonged skin exposure outdoors.'
        : isHot
        ? 'Very warm conditions. Hydrate actively and seek shade.'
        : 'Prime conditions for outdoor routines and recreation.',
      suitableActivities: suitableActivities.slice(0, 3),
      cautions: cautions.slice(0, 2),
    },
  };
}
