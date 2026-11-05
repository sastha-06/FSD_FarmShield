import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trees,
  Maximize2,
  Sprout,
  ScanEye,
  ArrowRight,
  Plus,
  Calendar,
  AlertCircle,
  BrainCircuit,
  Compass,
  CheckCircle2,
  Droplets,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const DashboardPage = ({ onOpenAddField }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stats/dashboard');
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      setError('Could not load dashboard information. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  const stats = data?.stats || {
    totalFields: 0,
    totalAreaAcres: 0,
    plantedCropsCount: 0,
    totalAnalyses: 0,
  };

  const recentFields = data?.recentFields || [];
  const recentAnalyses = data?.recentAnalyses || [];
  const recentAdvisories = data?.recentAdvisories || [];
  const recommendations = data?.sampleRecommendations || [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* STATISTICS CARDS (Fetched from actual DB) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Stat 1: Total Fields */}
        <Card hover className="p-5 flex items-center justify-between border-l-4 border-l-forest-green h-full">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-muted-green uppercase tracking-wider leading-snug">
              {t('dashboard.registeredFields')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal mt-1">
              {stats.totalFields}
            </h3>
            <p className="text-[11px] text-muted-green mt-1 flex items-center gap-1">
              <span>{t('dashboard.parcelsManaged')}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-light-sage/60 text-forest-green flex items-center justify-center flex-shrink-0">
            <Trees className="w-6 h-6" />
          </div>
        </Card>

        {/* Stat 2: Total Cultivated Area */}
        <Card hover className="p-5 flex items-center justify-between border-l-4 border-l-fresh-green h-full">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-muted-green uppercase tracking-wider leading-snug">
              {t('dashboard.totalCultivatedArea')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal mt-1">
              {stats.totalAreaAcres}{' '}
              <span className="text-sm font-semibold text-muted-green">{t('common.acres')}</span>
            </h3>
            <p className="text-[11px] text-muted-green mt-1">{t('dashboard.aggregateAcreage')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-light-sage/60 text-fresh-green flex items-center justify-center flex-shrink-0">
            <Maximize2 className="w-6 h-6" />
          </div>
        </Card>

        {/* Stat 3: Planted Crops */}
        <Card hover className="p-5 flex items-center justify-between border-l-4 border-l-warning-amber h-full">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-muted-green uppercase tracking-wider leading-snug">
              {t('dashboard.plantedCropsCount')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal mt-1">
              {stats.plantedCropsCount}
            </h3>
            <p className="text-[11px] text-muted-green mt-1">{t('dashboard.activeCrops')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FCF7ED] text-warning-amber flex items-center justify-center flex-shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
        </Card>

        {/* Stat 4: Total Analyses */}
        <Card hover className="p-5 flex items-center justify-between border-l-4 border-l-[#205799] h-full">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-muted-green uppercase tracking-wider leading-snug">
              {t('dashboard.totalAnalysesCount')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal mt-1">
              {stats.totalAnalyses}
            </h3>
            <p className="text-[11px] text-muted-green mt-1">{t('dashboard.cumulativeScans')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F1FC] text-[#205799] flex items-center justify-center flex-shrink-0">
            <ScanEye className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* QUICK LAUNCH BANNER IF ZERO FIELDS (EMPTY STATE) */}
      {stats.totalFields === 0 && (
        <div className="bg-gradient-to-r from-forest-green to-[#235841] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <Badge variant="default" size="sm" className="bg-light-sage text-forest-green">
              {t('landing.heroBadge')}
            </Badge>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              {t('fields.emptyStateTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed">
              {t('fields.emptyStateDesc')}
            </p>
          </div>
          <Button
            onClick={onOpenAddField}
            variant="secondary"
            size="lg"
            icon={Plus}
            className="flex-shrink-0"
          >
            {t('dashboard.actionAddField')}
          </Button>
        </div>
      )}

      {/* MAIN TWO-COLUMN DASHBOARD SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols): My Recent Fields & Crop Recommendations */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* SECTION 1: MY RECENT FIELDS */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                  <Trees className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span>{t('dashboard.recentFieldsTitle')}</span>
                </h3>
                <p className="text-xs text-muted-green">
                  {t('fields.subtitle')}
                </p>
              </div>
              <Link to="/fields" className="text-xs font-semibold text-forest-green hover:text-fresh-green flex items-center gap-1">
                <span>{t('dashboard.viewAllFields')}</span> <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
              </Link>
            </div>

            {recentFields.length === 0 ? (
              <Card className="p-8 text-center bg-soft-cream/40 border-dashed">
                <Trees className="w-10 h-10 text-muted-green mx-auto mb-3 opacity-60" />
                <h4 className="text-sm font-semibold text-deep-charcoal">{t('dashboard.noFieldsMessage')}</h4>
                <div className="mt-4">
                  <Button onClick={onOpenAddField} variant="primary" size="sm" icon={Plus}>
                    {t('dashboard.actionAddField')}
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentFields.map((field) => (
                  <Card key={field._id} hover className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-sm text-deep-charcoal font-heading break-words">
                          {field.fieldName}
                        </h4>
                        <Badge
                          variant={field.isCropPlanted ? 'success' : 'neutral'}
                          size="sm"
                          dot
                        >
                          {field.isCropPlanted ? 'Planted' : 'Unplanted'}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-green flex items-center gap-1.5 mb-3">
                        <span>{field.village}, {field.district}</span>
                      </p>

                      <div className="space-y-1.5 text-xs text-deep-charcoal/90 bg-soft-cream/50 p-2.5 rounded-xl border border-border-green/70">
                        <div className="flex justify-between">
                          <span className="text-muted-green">{t('fields.cardAcreage')}:</span>
                          <span className="font-medium">{field.area} {field.areaUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-green">{t('fields.cardSoil')}:</span>
                          <span className="font-medium">{field.soilType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-green">{t('fields.cardWater')}:</span>
                          <span className="font-medium">{field.irrigationMethod}</span>
                        </div>
                        {field.isCropPlanted && (
                          <div className="flex justify-between text-forest-green font-semibold pt-1 border-t border-border-green/60">
                            <span>{t('fields.cardCrop')}:</span>
                            <span className="text-right">{field.cropName} {field.cropVariety ? `(${field.cropVariety})` : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-green/80 flex items-center justify-between text-xs">
                      <Link
                        to={`/crops?fieldId=${field._id}`}
                        className="font-semibold text-forest-green hover:underline flex items-center gap-1"
                      >
                        <span>{t('fields.btnPlan')}</span> <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={`/analysis?fieldId=${field._id}`}
                        className="text-xs text-muted-green hover:text-forest-green font-medium flex items-center gap-1"
                      >
                        <ScanEye className="w-3.5 h-3.5" /> <span>{t('fields.btnAnalyze')}</span>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: CROP RECOMMENDATIONS PREVIEW */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span>{t('dashboard.topRecommendationsTitle')}</span>
                </h3>
                <p className="text-xs text-muted-green">
                  {t('cropPlanning.subtitle')}
                </p>
              </div>
              <Link to="/crops" className="text-xs font-semibold text-forest-green hover:text-fresh-green flex items-center gap-1">
                <span>{t('dashboard.exploreCrops')}</span> <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <Card key={idx} hover className="overflow-hidden p-0 flex flex-col justify-between">
                  <div className="h-32 sm:h-36 relative overflow-hidden bg-forest-green/10 flex-shrink-0">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-forest-green shadow-sm">
                      Score: {rec.score}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-deep-charcoal font-heading leading-snug">
                        {rec.shortName || rec.name.split('(')[0]}
                      </h4>
                      <p className="text-[11px] text-muted-green mb-2">{rec.category}</p>
                      <p className="text-xs text-deep-charcoal/80 line-clamp-2 leading-relaxed mb-3">
                        {rec.suitabilityExplanation}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border-green/80 flex items-center justify-between text-[11px]">
                      <span className="text-muted-green">Duration:</span>
                      <span className="font-semibold text-forest-green">{rec.growingDuration}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Recent Analyses & Advisories */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          {/* SECTION 3: RECENT CROP ANALYSES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                <ScanEye className="w-5 h-5 text-fresh-green flex-shrink-0" />
                <span>{t('dashboard.recentAnalysesTitle')}</span>
              </h3>
              <Link to="/history" className="text-xs font-semibold text-forest-green hover:text-fresh-green">
                {t('dashboard.viewAllAnalyses')}
              </Link>
            </div>

            {recentAnalyses.length === 0 ? (
              <Card className="p-6 text-center bg-soft-cream/40 border-dashed">
                <ScanEye className="w-8 h-8 text-muted-green mx-auto mb-2 opacity-60" />
                <p className="text-xs text-muted-green leading-relaxed">{t('dashboard.noAnalysesMessage')}</p>
                <Link to="/analysis" className="inline-block mt-3">
                  <Button variant="sage" size="sm" icon={ScanEye}>
                    {t('fields.btnAnalyze')}
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => {
                  const isHealthy = analysis.predictedCondition.toLowerCase().includes('healthy');
                  return (
                    <Card key={analysis._id} hover className="p-3.5 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-soft-cream border border-border-green flex-shrink-0">
                        <img
                          src={analysis.imageUrl}
                          alt="Leaf Diagnosis"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h5 className="text-xs font-bold text-deep-charcoal truncate">
                            {analysis.predictedCondition.split('(')[0]}
                          </h5>
                          <Badge variant={isHealthy ? 'success' : 'warning'} size="sm">
                            {analysis.confidence}%
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-green truncate">
                          {t('fields.cardSoil')}: {analysis.fieldId?.fieldName || 'Registered'}
                        </p>
                        <p className="text-[10px] text-muted-green">
                          {new Date(analysis.analysisDate).toLocaleDateString()}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 4: RECENT AGRICULTURAL ADVISORIES (STANDOUT) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-fresh-green flex-shrink-0" />
                <span>{t('cropAnalysis.sec2Title')}</span>
              </h3>
            </div>

            {recentAdvisories.length === 0 ? (
              <Card className="p-6 text-center bg-soft-cream/40 border-dashed">
                <BrainCircuit className="w-8 h-8 text-muted-green mx-auto mb-2 opacity-60" />
                <p className="text-xs text-muted-green leading-relaxed">
                  {t('cropAnalysis.sec2Desc')}
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentAdvisories.map((item, idx) => (
                  <Card key={idx} className="p-4 bg-gradient-to-br from-white to-light-sage/20 border-light-sage space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-forest-green flex items-center gap-1.5 truncate">
                        <BrainCircuit className="w-3.5 h-3.5 text-fresh-green flex-shrink-0" />
                        <span className="truncate">{item.analysis?.predictedCondition?.split('(')[0]}</span>
                      </span>
                      <span className="text-[10px] text-muted-green flex-shrink-0">
                        {new Date(item.advisory?.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-deep-charcoal/80 leading-relaxed line-clamp-2">
                      {item.advisory?.contributingFactors?.environmental ||
                       item.advisory?.precautions?.[0] ||
                       'Field-tailored precautions generated.'}
                    </p>

                    <div className="pt-2 border-t border-border-green/80 flex items-center justify-between text-[11px]">
                      <span className="text-muted-green truncate max-w-[150px]">
                        {item.analysis?.fieldId?.fieldName || 'Registered'}
                      </span>
                      <Link
                        to={`/history`}
                        className="font-semibold text-forest-green hover:underline flex items-center gap-1"
                      >
                        <span>{t('history.btnViewReport')}</span> <ArrowRight className="w-3 h-3 flex-shrink-0" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
