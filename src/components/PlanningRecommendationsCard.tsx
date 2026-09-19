import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Umbrella,
  Shirt,
  Layers,
  Shield,
  Footprints,
  Wind,
  Sun,
  Glasses,
  Droplets,
  Zap,
  Sparkles,
} from 'lucide-react';
import { PlanningInsights, RecommendationItem } from '../types';

interface PlanningRecommendationsCardProps {
  insights: PlanningInsights;
}

export function PlanningRecommendationsCard({ insights }: PlanningRecommendationsCardProps) {
  const { comfortLevel, comfortSummary, recommendations, activityGuidance } = insights;

  const renderItemIcon = (iconName: string) => {
    const iconClass = 'w-4 h-4 text-cyan-400';
    switch (iconName) {
      case 'Umbrella':
        return <Umbrella className={iconClass} />;
      case 'Shirt':
        return <Shirt className={iconClass} />;
      case 'Layers':
        return <Layers className={iconClass} />;
      case 'Footprints':
        return <Footprints className={iconClass} />;
      case 'Wind':
        return <Wind className={iconClass} />;
      case 'Sun':
        return <Sun className={iconClass} />;
      case 'Glasses':
        return <Glasses className={iconClass} />;
      case 'Droplets':
        return <Droplets className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      default:
        return <Shield className={iconClass} />;
    }
  };

  const getImportanceBadge = (importance: RecommendationItem['importance']) => {
    switch (importance) {
      case 'essential':
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            Must Have
          </span>
        );
      case 'recommended':
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Advised
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50">
            Optional
          </span>
        );
    }
  };

  return (
    <div
      id="planning-recommendations-card"
      className="rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 md:p-7 shadow-xl backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
              Planning & Clothing Intelligence
            </h3>
            <p className="text-xs text-slate-400">{comfortSummary}</p>
          </div>
        </div>

        {/* Comfort badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">{comfortLevel}</span>
        </div>
      </div>

      {/* Grid of Contextual Recommendations */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Recommended Outfit & Essentials
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              id={`recommendation-item-${rec.id}`}
              className="p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/40 transition-colors flex flex-col justify-between gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0">
                    {renderItemIcon(rec.icon)}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{rec.title}</h4>
                </div>
                {getImportanceBadge(rec.importance)}
              </div>
              <p className="text-xs text-slate-400 pl-1 leading-relaxed">{rec.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Suitability Section */}
      <div className="pt-5 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Outdoor Viability Guidance</span>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold self-start sm:self-auto ${activityGuidance.viabilityColor}`}
          >
            <span>Viability: {activityGuidance.outdoorViability}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-3">{activityGuidance.summary}</p>

        {/* Suitable activities pills */}
        {activityGuidance.suitableActivities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {activityGuidance.suitableActivities.map((act, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/60 text-xs"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{act}</span>
              </span>
            ))}
          </div>
        )}

        {/* Cautions / Hazards if any */}
        {activityGuidance.cautions.length > 0 && (
          <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-800/50">
            {activityGuidance.cautions.map((caution, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{caution}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
