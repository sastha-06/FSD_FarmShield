import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sprout,
  Compass,
  Trees,
  CloudSun,
  Droplets,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Wind,
  Thermometer,
  ShieldCheck,
  FlaskConical,
  Activity,
  Calculator,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const CropPlanningPage = ({ onOpenAddField }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const preselectedFieldId = searchParams.get('fieldId');

  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(preselectedFieldId || '');
  const [fieldDetails, setFieldDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [error, setError] = useState('');

  // Expandable Factor Explanations per Crop Card
  const [expandedFactorCrop, setExpandedFactorCrop] = useState(null);
  // Expandable Profitability Estimator per Crop Card
  const [expandedEconCrop, setExpandedEconCrop] = useState(null);
  // Custom price overrides per crop shortName
  const [customPrices, setCustomPrices] = useState({});

  // 1. Fetch all fields
  useEffect(() => {
    const loadFields = async () => {
      try {
        setLoading(true);
        const res = await api.get('/fields');
        if (res.data?.success) {
          const loaded = res.data.fields || [];
          setFields(loaded);
          if (preselectedFieldId && loaded.some((f) => f._id === preselectedFieldId)) {
            setSelectedFieldId(preselectedFieldId);
          } else if (loaded.length > 0 && !selectedFieldId) {
            setSelectedFieldId(loaded[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load fields:', err);
        setError('Could not load your registered fields.');
      } finally {
        setLoading(false);
      }
    };
    loadFields();
  }, [preselectedFieldId]);

  // 2. Fetch crop details when selected field changes
  useEffect(() => {
    if (!selectedFieldId) return;

    const loadCropDetails = async () => {
      try {
        setFetchingDetails(true);
        setError('');
        const res = await api.get(`/crops/${selectedFieldId}`);
        if (res.data?.success) {
          setFieldDetails(res.data);
        }
      } catch (err) {
        console.error('Failed to load crop details for field:', err);
        setError('Failed to retrieve crop details for the selected field.');
      } finally {
        setFetchingDetails(false);
      }
    };

    loadCropDetails();
  }, [selectedFieldId]);

  if (loading) {
    return <LoadingSpinner text={t('cropPlanning.initializing', 'Initializing agronomic planning center...')} />;
  }

  if (fields.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-heading text-forest-green flex items-center gap-2">
          <Sprout className="w-6 h-6 text-fresh-green flex-shrink-0" /> {t('cropPlanning.title', 'Smart Crop Planning & Recommendations')}
        </h2>
        <Card className="p-12 text-center bg-soft-cream/40 border-dashed">
          <Sprout className="w-12 h-12 text-muted-green mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-deep-charcoal">{t('cropPlanning.noFieldsRegistered', 'No Fields Registered')}</h3>
          <p className="text-xs text-muted-green mt-1 max-w-md mx-auto mb-5 leading-relaxed">
            {t('cropPlanning.noFieldsDesc', 'Register your agricultural parcel to unlock tailored multi-factor crop recommendations based on your soil profile, water capacity, and live weather forecast.')}
          </p>
          <Button onClick={onOpenAddField} variant="primary" icon={Sprout}>
            {t('cropPlanning.registerFieldBtn', 'Register a Field Now')}
          </Button>
        </Card>
      </div>
    );
  }

  const isPlanted = fieldDetails?.isCropPlanted;
  const currentField = fieldDetails?.field;
  const growth = fieldDetails?.growthStage;
  const recData = fieldDetails?.recommendations;
  const recommendations = recData?.recommendations || [];
  const completeness = recData?.dataCompleteness;
  const weather = fieldDetails?.weather;
  const riskAlerts = fieldDetails?.riskAlerts || [];

  // Helper to get adjusted profitability
  const getAdjustedProfitability = (rec) => {
    const cropEcon = rec.profitability;
    if (!cropEcon) return null;

    const cropKey = rec.shortName;
    const userPrice = customPrices[cropKey];

    if (userPrice && !isNaN(Number(userPrice)) && Number(userPrice) > 0) {
      const priceNum = Number(userPrice);
      const avgYield = (cropEcon.expectedYieldRange.min + cropEcon.expectedYieldRange.max) / 2;
      const expectedRevenue = Math.round(avgYield * priceNum);
      const estimatedNetProfit = expectedRevenue - cropEcon.totalCultivationCost;
      const breakEvenPrice = avgYield > 0 ? Math.round(cropEcon.totalCultivationCost / avgYield) : 0;
      const profitMarginPercent = expectedRevenue > 0 ? Math.round((estimatedNetProfit / expectedRevenue) * 100) : 0;

      return {
        ...cropEcon,
        marketPriceUsed: priceNum,
        isCustomPrice: true,
        expectedRevenue,
        estimatedNetProfit,
        breakEvenPrice,
        profitMarginPercent,
      };
    }
    return cropEcon;
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Field Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border-green">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-forest-green flex items-center gap-2">
            <Sprout className="w-6 h-6 text-fresh-green flex-shrink-0" /> {t('cropPlanning.title', 'Multi-Factor Smart Crop Planning & Intelligence')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-green mt-0.5 leading-relaxed">
            {t('cropPlanning.subtitle', 'Transparent agronomic decision support combining regional agro-climatic calendars, Open-Meteo forecasts, soil health, and water reserves')}
          </p>
        </div>

        {/* Field Selector Dropdown */}
        <div className="w-full sm:w-80">
          <label className="block text-[11px] font-bold text-muted-green uppercase tracking-wider mb-1">
            {t('cropPlanning.selectFieldPrompt', 'Active Agricultural Plot')}
          </label>
          <select
            value={selectedFieldId}
            onChange={(e) => setSelectedFieldId(e.target.value)}
            className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-border-green focus:border-forest-green bg-white shadow-sm"
          >
            {fields.map((f) => (
              <option key={f._id} value={f._id}>
                {f.fieldName} ({f.isCropPlanted ? `${t('fields.cardCrop', 'Planted')}: ${f.cropName}` : t('fields.emptyStateDesc', 'Unplanted Plot')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {fetchingDetails ? (
        <LoadingSpinner text={t('cropPlanning.evaluating', 'Evaluating agro-climatic models, Open-Meteo forecasts, and soil health profiles...')} />
      ) : (
        <>
          {/* ============================================================== */}
          {/* 1. COMPREHENSIVE FIELD AGRONOMIC PROFILE STRIP */}
          {/* ============================================================== */}
          {currentField && (
            <div className="bg-white rounded-2xl p-5 border border-border-green shadow-sm grid grid-cols-2 sm:grid-cols-6 gap-4 text-xs">
              <div>
                <span className="text-muted-green block text-[10px] uppercase font-bold">{t('cropPlanning.plotArea', 'Plot & Area')}</span>
                <span className="font-bold text-deep-charcoal text-sm break-words">{currentField.fieldName}</span>
                <span className="text-[11px] text-muted-green block">
                  {currentField.area} {currentField.areaUnit || t('fields.cardAcreage', 'Acres')}
                </span>
              </div>

              <div>
                <span className="text-muted-green block text-[10px] uppercase font-bold">{t('cropPlanning.digipinLocation', 'DIGIPIN & Location')}</span>
                <span className="font-semibold text-deep-charcoal truncate block">
                  {currentField.village}, {currentField.district}
                </span>
                {currentField.digipin ? (
                  <span className="text-[11px] font-mono font-bold text-forest-green block">
                    {currentField.digipin}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-green italic">GPS Marker</span>
                )}
              </div>

              <div>
                <span className="text-muted-green block text-[10px] uppercase font-bold">{t('cropPlanning.soilProfile', 'Soil Profile')}</span>
                <span className="font-semibold text-deep-charcoal">{currentField.soilType}</span>
                <span className="text-[10px] text-muted-green block">
                  {currentField.soilDrainage || t('cropPlanning.drainageUnrecorded', 'Drainage unrecorded')}
                </span>
              </div>

              <div>
                <span className="text-muted-green block text-[10px] uppercase font-bold">{t('cropPlanning.soilHealth', 'Soil pH & Health')}</span>
                {currentField.soilPh !== null && currentField.soilPh !== undefined ? (
                  <span className="font-bold text-forest-green block">
                    pH {currentField.soilPh} ({t('common.tested', 'Tested')})
                  </span>
                ) : (
                  <span className="text-[11px] text-warning-amber font-semibold block">
                    {t('cropPlanning.phUnmeasured', 'pH Unmeasured')}
                  </span>
                )}
                <span className="text-[10px] text-muted-green block">
                  {currentField.soilNitrogen ? `N: ${currentField.soilNitrogen} kg/ha` : t('cropPlanning.npkUnlogged', 'NPK unlogged')}
                </span>
              </div>

              <div>
                <span className="text-muted-green block text-[10px] uppercase font-bold">{t('cropPlanning.waterCapacity', 'Water Capacity')}</span>
                <span className="font-semibold text-deep-charcoal block">
                  {currentField.waterAvailability ? `${currentField.waterAvailability} ${t('cropPlanning.availability', 'Availability')}` : t('cropPlanning.waterUnrated', 'Water unrated')}
                </span>
                <span className="text-[10px] text-muted-green block truncate">
                  {currentField.waterSource || currentField.irrigationMethod}
                </span>
              </div>

              <div>
                <span className="text-muted-green block text-[10px] uppercase font-bold">{t('cropPlanning.status', 'Status')}</span>
                <Badge variant={isPlanted ? 'success' : 'neutral'} size="sm" dot>
                  {isPlanted ? t('cropPlanning.cropPlanted', 'Crop Planted') : t('cropPlanning.unplantedFallow', 'Unplanted / Fallow')}
                </Badge>
                {currentField.previousCrop && (
                  <span className="text-[10px] text-muted-green block mt-1 truncate">
                    {t('cropPlanning.prevCrop', 'Prev')}: {currentField.previousCrop}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. WEATHER INTELLIGENCE SECTION (OPEN-METEO) */}
          {/* ============================================================== */}
          <div className="bg-white rounded-2xl p-5 border border-border-green shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-border-green">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-forest-green flex-shrink-0" />
                <h3 className="text-sm font-bold font-heading text-forest-green uppercase tracking-wider">
                  {t('cropPlanning.weatherIntelligenceTitle', 'Field Meteorological Intelligence & 7-Day Forecast')}
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={weather?.isAvailable ? 'success' : 'warning'} size="sm">
                  {weather?.isAvailable ? t('cropPlanning.liveWeather', 'Live Open-Meteo Data') : t('cropPlanning.historicalBaseline', 'Historical Regional Baseline')}
                </Badge>
                {weather?.lastUpdated && (
                  <span className="text-[10px] text-muted-green">
                    {t('cropPlanning.updated', 'Updated')}: {new Date(weather.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>

            {weather && weather.isAvailable ? (
              <div className="space-y-4">
                {/* Current Weather Cards Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-xl bg-soft-cream/60 border border-border-green">
                    <span className="text-[10px] uppercase font-bold text-muted-green block">{t('cropPlanning.currentWeather', 'Current Weather')}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl flex-shrink-0">{weather.current?.icon || '⛅'}</span>
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-deep-charcoal block truncate">
                          {weather.current?.weatherCondition || weather.weatherCondition}
                        </span>
                        <span className="text-[10px] text-muted-green truncate block">{weather.locationName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-soft-cream/60 border border-border-green">
                    <span className="text-[10px] uppercase font-bold text-muted-green block">{t('cropPlanning.airTemperature', 'Air Temperature')}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Thermometer className="w-4 h-4 text-forest-green flex-shrink-0" />
                      <span className="text-lg font-bold text-deep-charcoal">
                        {weather.current?.temperature ?? weather.temperature}°C
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-green">{t('cropPlanning.ambientTemp', 'Ambient Field Temp')}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-soft-cream/60 border border-border-green">
                    <span className="text-[10px] uppercase font-bold text-muted-green block">{t('cropPlanning.relativeHumidity', 'Relative Humidity')}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Droplets className="w-4 h-4 text-forest-green flex-shrink-0" />
                      <span className="text-lg font-bold text-deep-charcoal">
                        {weather.current?.humidity ?? weather.humidity}%
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-green">{t('cropPlanning.canopyMoisture', 'Canopy Moisture')}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-soft-cream/60 border border-border-green">
                    <span className="text-[10px] uppercase font-bold text-muted-green block">{t('cropPlanning.precipitationWind', 'Precipitation & Wind')}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Wind className="w-4 h-4 text-forest-green flex-shrink-0" />
                      <span className="text-sm font-bold text-deep-charcoal">
                        {weather.current?.rainfall ?? weather.rainfall} mm | {weather.current?.windSpeed ?? weather.windSpeed} km/h
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-green">{t('cropPlanning.surfaceRunoffWind', 'Surface Runoff / Wind')}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-soft-cream/60 border border-border-green">
                    <span className="text-[10px] uppercase font-bold text-muted-green block">{t('cropPlanning.estSoilMoisture', 'Est. Soil Moisture')}</span>
                    {weather.soilMoistureEstimate ? (
                      <div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-forest-green">
                            {weather.soilMoistureEstimate.percentage}% ({weather.soilMoistureEstimate.category})
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-green">
                          Surface: {weather.soilMoistureEstimate.soilTempSurfaceC !== null ? `${weather.soilMoistureEstimate.soilTempSurfaceC}°C` : 'Modelled'}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-semibold text-deep-charcoal mt-1 block">Modelled</span>
                        <span className="text-[10px] text-muted-green">Based on rainfall</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 7-Day Forecast Strip */}
                {weather.forecast && weather.forecast.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold text-forest-green uppercase tracking-wider mb-2">
                      {t('cropPlanning.forecast7Day', '7-Day Agricultural Forecast (Open-Meteo ECMWF / GFS)')}
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                      {weather.forecast.map((day, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border border-border-green text-center text-xs bg-soft-cream/20"
                        >
                          <span className="text-[10px] font-bold text-deep-charcoal block truncate">
                            {new Date(day.date).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-sm font-bold text-forest-green block my-0.5">
                            {day.maxTemp}° / {day.minTemp}°
                          </span>
                          <span className="text-[10px] text-muted-green block">
                            🌧️ {day.precipitationSumMm} mm
                          </span>
                          {day.precipProbabilityMax > 0 && (
                            <span className="text-[9px] text-forest-green font-semibold block">
                              {day.precipProbabilityMax}% {t('cropPlanning.prob', 'prob.')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agro-Climatic Normal Baseline & Source Disclaimer */}
                <div className="p-3 rounded-xl bg-light-sage/20 border border-light-sage text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-forest-green flex-shrink-0" />
                    <p className="text-deep-charcoal text-[11px] leading-relaxed">
                      <strong>{t('cropPlanning.agroClimaticZone', 'Agro-Climatic Zone')}:</strong> {weather.climateBaseline?.agroClimaticZone || 'Peninsular Zone'} •{' '}
                      <strong>{t('cropPlanning.monthlyNormal', 'Monthly Climate Normal')}:</strong> ~{weather.climateBaseline?.normalMonthlyRainfallMm || 80} mm rainfall, {weather.climateBaseline?.normalAvgTempC || 28}°C normal temp.
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-green italic">
                    ℹ️ {weather.disclaimer}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-soft-cream border border-border-green text-xs space-y-2">
                <div className="flex items-center gap-2 text-warning-amber font-semibold">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{t('cropPlanning.weatherUnavailable', 'Weather service temporarily unavailable.')}</span>
                </div>
                <p className="text-muted-green text-[11px] leading-relaxed">
                  {weather?.disclaimer || 'Weather data is temporarily unavailable. Recommendations are based only on the available field and agricultural information.'}
                </p>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 3. FARM CLIMATE RISK ALERTS BANNER (IF ANY DETECTED) */}
          {/* ============================================================== */}
          {riskAlerts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-warning-amber flex-shrink-0" />
                <h3 className="text-sm font-bold font-heading text-forest-green uppercase tracking-wider">
                  {t('cropPlanning.climateAlertsTitle', 'Active Climate & Agronomic Risk Advisories')}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {riskAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      alert.badgeColor === 'red'
                        ? 'bg-red-50/70 border-error-red/30'
                        : alert.badgeColor === 'amber'
                        ? 'bg-amber-50/70 border-warning-amber/30'
                        : 'bg-green-50/70 border-fresh-green/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-deep-charcoal flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-warning-amber flex-shrink-0" /> {alert.title}
                      </span>
                      <Badge variant={alert.badgeColor === 'red' ? 'danger' : 'warning'} size="sm">
                        {alert.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-deep-charcoal mb-2 leading-relaxed">{alert.reason}</p>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-border-green/60 text-[11px]">
                      <span className="font-bold text-forest-green block mb-0.5">{t('cropPlanning.preventiveAction', 'Practical Preventive Action')}:</span>
                      <span className="text-muted-green">{alert.preventiveAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. CASE A: CROP NOT PLANTED -> MULTI-FACTOR RECOMMENDATIONS */}
          {/* ============================================================== */}
          {!isPlanted && (
            <div className="space-y-6">
              {/* Recommendations Header & Data Completeness Bar */}
              <div className="bg-white rounded-2xl p-5 border border-border-green shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-fresh-green flex-shrink-0" /> {t('cropPlanning.recommendationsHeader', 'Top 3 Multi-Factor Recommended Crops')}
                    </h3>
                    <p className="text-xs text-muted-green mt-0.5 leading-relaxed">
                      {t('cropPlanning.factorBreakdownSub', 'Evaluated across Location (15%), Season (15%), Weather (15%), Soil Type & Drainage (10%), Nutrients & pH (15%), Water (15%), Irrigation (5%), Rotation (5%)')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="default" size="md">
                      {t('cropPlanning.factorSeason', 'Season')}: {recData?.season} ({recData?.tamilNaduPattam})
                    </Badge>
                    {completeness && (
                      <Badge variant={completeness.isProvisional ? 'warning' : 'success'} size="md">
                        {completeness.statusLabel}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Data Completeness Bar */}
                {completeness && (
                  <div className="p-3 rounded-xl bg-soft-cream/60 border border-border-green space-y-2">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="font-semibold text-deep-charcoal flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-forest-green flex-shrink-0" /> {t('cropPlanning.dataCompleteness', 'Data Completeness')}: {completeness.percentage}%
                      </span>
                      <span className="text-[11px] text-muted-green">
                        {completeness.available.length} {t('common.provided', 'Provided')} / {completeness.missing.length} {t('common.missing', 'Missing')}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-border-green overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          completeness.percentage >= 75 ? 'bg-forest-green' : completeness.percentage >= 50 ? 'bg-fresh-green' : 'bg-warning-amber'
                        }`}
                        style={{ width: `${completeness.percentage}%` }}
                      />
                    </div>

                    {completeness.missing.length > 0 && (
                      <p className="text-[10px] text-muted-green italic leading-relaxed">
                        {t('cropPlanning.missingInputs', 'Missing inputs')}: <strong>{completeness.missing.join(', ')}</strong>. {t('cropPlanning.provisionalNotice', 'Adding soil test values or water availability in Field Settings converts provisional recommendations into definitive agronomic guidance.')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* No viable crops check */}
              {recommendations.length === 0 && (
                <Card className="p-8 text-center bg-soft-cream border-dashed">
                  <AlertTriangle className="w-10 h-10 text-warning-amber mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-deep-charcoal">{t('cropPlanning.noViableCrops', 'No Viable Crops Found')}</h4>
                  <p className="text-xs text-muted-green max-w-lg mx-auto mt-1 leading-relaxed">
                    {recData?.noViableCropsExplanation || 'None of the candidate crops satisfied the minimum suitability and water requirements for this plot.'}
                  </p>
                </Card>
              )}

              {/* 3 Crop Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((crop, idx) => {
                  const econ = getAdjustedProfitability(crop);
                  const isFactorsOpen = expandedFactorCrop === idx;
                  const isEconOpen = expandedEconCrop === idx;

                  const suitCat = crop.suitabilityCategory === 'Highly Suitable'
                    ? t('cropPlanning.categoryHighlySuitable', 'Highly Suitable')
                    : crop.suitabilityCategory === 'Moderately Suitable'
                    ? t('cropPlanning.categoryModeratelySuitable', 'Moderately Suitable')
                    : t('cropPlanning.categoryNotRecommended', 'Low Suitability');

                  return (
                    <Card
                      key={idx}
                      className="p-0 overflow-hidden flex flex-col justify-between border-2 border-border-green hover:border-fresh-green transition-all shadow-sm"
                    >
                      <div>
                        {/* Crop Image & Header Badges */}
                        <div className="h-44 relative bg-forest-green/10">
                          <img
                            src={crop.image}
                            alt={crop.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 bg-forest-green text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                            {t('cropPlanning.rank', 'Rank')} #{idx + 1} • {crop.score}/100
                          </div>
                          <div className="absolute top-3 left-3">
                            <Badge
                              variant={crop.suitabilityCategory === 'Highly Suitable' ? 'success' : crop.suitabilityCategory === 'Moderately Suitable' ? 'warning' : 'danger'}
                              size="sm"
                            >
                              {suitCat}
                            </Badge>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-5 space-y-4">
                          <div>
                            <h4 className="text-base font-bold font-heading text-deep-charcoal break-words">
                              {crop.name}
                            </h4>
                            <p className="text-xs text-fresh-green font-medium">
                              {crop.category} • <em>{crop.scientificName}</em>
                            </p>
                          </div>

                          {/* Quick Specs Grid */}
                          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-soft-cream/60 border border-border-green text-[11px]">
                            <div>
                              <span className="text-muted-green block text-[9px] uppercase font-bold">{t('cropPlanning.factorSeason', 'Planting Window')}</span>
                              <span className="font-semibold text-deep-charcoal truncate block">{crop.plantingWindow}</span>
                            </div>
                            <div>
                              <span className="text-muted-green block text-[9px] uppercase font-bold">{t('cropPlanning.factorWater', 'Water Demand')}</span>
                              <span className="font-bold text-forest-green block">{crop.waterRequirements?.split('.')[0] || 'Moderate'}</span>
                            </div>
                            <div>
                              <span className="text-muted-green block text-[9px] uppercase font-bold">{t('cropPlanning.growthDuration', 'Growth Duration')}</span>
                              <span className="font-semibold text-deep-charcoal">{crop.growingDuration}</span>
                            </div>
                            <div>
                              <span className="text-muted-green block text-[9px] uppercase font-bold">{t('cropPlanning.factorSoilType', 'Soil Texture')}</span>
                              <span className="font-semibold text-deep-charcoal truncate block">{crop.soilRequirements?.split('.')[0] || 'Loam'}</span>
                            </div>
                          </div>

                          {/* Key Reasons for Recommendation */}
                          {crop.reasons && crop.reasons.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-bold text-forest-green flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-fresh-green flex-shrink-0" /> {t('cropPlanning.positiveDrivers', 'Why this crop is recommended')}:
                              </span>
                              <ul className="text-xs text-deep-charcoal space-y-1 pl-4 list-disc">
                                {crop.reasons.slice(0, 3).map((r, rIdx) => (
                                  <li key={rIdx} className="leading-snug">{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Potential Risks / Agricultural Limitations */}
                          {crop.limitations && crop.limitations.length > 0 && (
                            <div className="p-3 rounded-xl bg-[#FCF7ED] border border-[#F7E2BF] text-xs text-[#945C0B] space-y-1">
                              <span className="font-bold flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-warning-amber flex-shrink-0" /> {t('cropPlanning.fieldRisks', 'Potential Field Risks')}:
                              </span>
                              <ul className="pl-4 list-disc space-y-0.5">
                                {crop.limitations.map((lim, lIdx) => (
                                  <li key={lIdx}>{lim}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* ==================================================== */}
                          {/* EXPANDABLE: FACTOR-WISE SCORE ACCORDION */}
                          {/* ==================================================== */}
                          <div className="pt-2 border-t border-border-green">
                            <button
                              type="button"
                              onClick={() => setExpandedFactorCrop(isFactorsOpen ? null : idx)}
                              className="w-full flex items-center justify-between text-xs font-bold text-forest-green hover:text-fresh-green transition-colors py-1"
                            >
                              <span>{t('cropPlanning.factorBreakdown', 'Factor-Wise Scoring Breakdown')}</span>
                              {isFactorsOpen ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                            </button>

                            {isFactorsOpen && crop.individualFactorScores && (
                              <div className="mt-3 space-y-2 p-3 rounded-xl bg-soft-cream/50 border border-border-green text-xs">
                                {[
                                  { label: t('cropPlanning.factorLocation', 'Location & Agro-Climatic'), weight: '15%', score: crop.individualFactorScores.location, exp: crop.factorExplanations?.location },
                                  { label: t('cropPlanning.factorSeason', 'Season & Planting Calendar'), weight: '15%', score: crop.individualFactorScores.season, exp: crop.factorExplanations?.season },
                                  { label: t('cropPlanning.factorWeather', 'Weather & Climate'), weight: '15%', score: crop.individualFactorScores.weather, exp: crop.factorExplanations?.weather },
                                  { label: t('cropPlanning.factorSoilType', 'Soil Type & Drainage'), weight: '10%', score: crop.individualFactorScores.soilTypeDrainage, exp: crop.factorExplanations?.soilTypeDrainage },
                                  { label: t('cropPlanning.factorNutrients', 'Soil Nutrients & pH'), weight: '15%', score: crop.individualFactorScores.nutrientsAndPh, exp: crop.factorExplanations?.nutrientsAndPh },
                                  { label: t('cropPlanning.factorWater', 'Water Availability'), weight: '15%', score: crop.individualFactorScores.waterAvailability, exp: crop.factorExplanations?.waterAvailability },
                                  { label: t('cropPlanning.factorIrrigation', 'Irrigation Compatibility'), weight: '5%', score: crop.individualFactorScores.irrigationCompatibility, exp: crop.factorExplanations?.irrigationCompatibility },
                                  { label: t('cropPlanning.factorRotation', 'Crop Rotation Benefit'), weight: '5%', score: crop.individualFactorScores.rotation, exp: crop.factorExplanations?.rotation },
                                ].map((item, fIdx) => (
                                  <div key={fIdx} className="space-y-0.5 pb-1.5 border-b border-border-green/50 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between text-[11px] gap-2">
                                      <span className="font-semibold text-deep-charcoal">{item.label} ({item.weight})</span>
                                      <span className={`font-bold flex-shrink-0 ${item.score >= 75 ? 'text-forest-green' : item.score >= 50 ? 'text-warning-amber' : 'text-error-red'}`}>
                                        {item.score}/100
                                      </span>
                                    </div>
                                    {item.exp && <p className="text-[10px] text-muted-green leading-tight">{item.exp}</p>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* ==================================================== */}
                          {/* EXPANDABLE: CROP PROFITABILITY & ECONOMICS ESTIMATOR */}
                          {/* ==================================================== */}
                          {econ && (
                            <div className="pt-2 border-t border-border-green">
                              <button
                                type="button"
                                onClick={() => setExpandedEconCrop(isEconOpen ? null : idx)}
                                className="w-full flex items-center justify-between text-xs font-bold text-forest-green hover:text-fresh-green transition-colors py-1"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Calculator className="w-3.5 h-3.5 text-fresh-green flex-shrink-0" /> {t('cropPlanning.economicsTitle', 'Crop Economics & Profitability')}
                                </span>
                                {isEconOpen ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                              </button>

                              {isEconOpen && (
                                <div className="mt-3 p-3 rounded-xl bg-light-sage/20 border border-light-sage text-xs space-y-3">
                                  {/* Economics Summary */}
                                  <div className="grid grid-cols-2 gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-white border border-border-green">
                                      <span className="text-[10px] uppercase font-bold text-muted-green block">{t('cropPlanning.expectedRevenue', 'Est. Revenue')}</span>
                                      <span className="text-sm font-bold text-forest-green block">
                                        ₹{econ.expectedRevenue.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="p-2 rounded-lg bg-white border border-border-green">
                                      <span className="text-[10px] uppercase font-bold text-muted-green block">{t('cropPlanning.netProfit', 'Net Profit')}</span>
                                      <span className={`text-sm font-bold ${econ.estimatedNetProfit >= 0 ? 'text-forest-green' : 'text-error-red'} block`}>
                                        ₹{econ.estimatedNetProfit.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Cost Breakdown */}
                                  <div className="space-y-1 text-[11px]">
                                    <div className="flex justify-between text-muted-green">
                                      <span>{t('cropPlanning.costPerAcre', 'Cultivation Cost')} ({econ.areaAcres} {t('fields.cardAcreage', 'Acre')}):</span>
                                      <strong className="text-deep-charcoal">₹{econ.totalCultivationCost.toLocaleString()}</strong>
                                    </div>
                                    <div className="flex justify-between text-muted-green">
                                      <span>{t('cropPlanning.expectedYield', 'Expected Yield')}:</span>
                                      <strong className="text-deep-charcoal">{econ.expectedYieldRange.min} - {econ.expectedYieldRange.max} {econ.expectedYieldRange.unit}</strong>
                                    </div>
                                    <div className="flex justify-between text-muted-green">
                                      <span>{t('cropPlanning.breakEvenPrice', 'Break-Even Price')}:</span>
                                      <strong className="text-deep-charcoal">₹{econ.breakEvenPrice} / {econ.expectedYieldRange.unit}</strong>
                                    </div>
                                  </div>

                                  {/* User Price Override Input */}
                                  <div className="pt-2 border-t border-border-green">
                                    <label className="block text-[10px] font-bold text-deep-charcoal mb-1">
                                      {t('cropPlanning.adjustMarketPrice', 'Adjust Market Price')} ({econ.marketPriceUnit}):
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        value={customPrices[crop.shortName] !== undefined ? customPrices[crop.shortName] : econ.marketPriceUsed}
                                        onChange={(e) =>
                                          setCustomPrices({ ...customPrices, [crop.shortName]: e.target.value })
                                        }
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-border-green text-xs font-semibold bg-white"
                                        placeholder="Market rate"
                                      />
                                      {customPrices[crop.shortName] !== undefined && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = { ...customPrices };
                                            delete updated[crop.shortName];
                                            setCustomPrices(updated);
                                          }}
                                          className="text-[10px] text-muted-green hover:text-error-red underline flex-shrink-0"
                                        >
                                          {t('common.reset', 'Reset')}
                                        </button>
                                      )}
                                    </div>
                                    <span className="text-[9px] text-muted-green mt-1 block">
                                      {t('cropPlanning.benchmark', 'Benchmark')}: ₹{crop.economics?.marketPriceBenchmark?.price} ({crop.economics?.marketPriceBenchmark?.source})
                                    </span>
                                  </div>

                                  <p className="text-[9px] text-muted-green italic">
                                    ℹ️ {econ.disclaimer}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Important Precautions */}
                          <div className="p-3 rounded-xl bg-soft-cream/60 border border-border-green text-xs text-deep-charcoal">
                            <span className="font-bold flex items-center gap-1.5 mb-1 text-forest-green">
                              <ShieldCheck className="w-3.5 h-3.5 text-fresh-green flex-shrink-0" /> {t('cropPlanning.practicalPrecautions', 'Practical Precautions')}:
                            </span>
                            <p className="text-[11px] leading-relaxed text-muted-green">{crop.recommendedPrecautions}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <p className="text-[10px] text-muted-green italic text-center">
                          {t('cropPlanning.tnauEvaluation', 'TNAU Agritech standard evaluation for')} {currentField?.district || 'Tamil Nadu'}.
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 5. CASE B: CROP ALREADY PLANTED -> GROWTH STAGE & MONITORING */}
          {/* ============================================================== */}
          {isPlanted && growth && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-fresh-green flex-shrink-0" /> {t('cropPlanning.lifecycleTitle', 'Planted Crop Lifecycle & Growth Stage')}
                  </h3>
                  <p className="text-xs text-muted-green leading-relaxed">
                    {t('cropPlanning.lifecycleSubtitle', 'Growth estimation automatically calculated from days elapsed since recorded sowing date')}
                  </p>
                </div>
                <Badge variant="warning" size="sm">
                  {t('cropPlanning.estimatedTimeline', 'Estimated Timeline')}
                </Badge>
              </div>

              {/* Main Growth Tracker Card */}
              <Card className="p-6 bg-white border-2 border-forest-green/20 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-border-green">
                  <div>
                    <span className="text-xs font-semibold text-muted-green uppercase tracking-wider block">
                      {t('cropPlanning.cultivatedCrop', 'Cultivated Crop')}
                    </span>
                    <h4 className="text-xl font-bold font-heading text-deep-charcoal mt-1 break-words">
                      {currentField.cropName}
                    </h4>
                    {currentField.cropVariety && (
                      <p className="text-xs text-fresh-green font-medium">{t('cropPlanning.variety', 'Variety')}: {currentField.cropVariety}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-muted-green uppercase tracking-wider block">
                      {t('cropPlanning.daysSincePlanting', 'Days Since Planting')}
                    </span>
                    <h4 className="text-xl font-bold font-heading text-forest-green mt-1 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-fresh-green flex-shrink-0" /> {growth.daysSincePlanting} {t('cropPlanning.days', 'Days')}
                    </h4>
                    <p className="text-xs text-muted-green mt-0.5">
                      {t('cropPlanning.sownOn', 'Sown on')}: {new Date(currentField.plantingDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-muted-green uppercase tracking-wider block">
                      {t('cropPlanning.estimatedStage', 'Estimated Growth Stage')}
                    </span>
                    <h4 className="text-xl font-bold font-heading text-deep-charcoal mt-1 break-words">
                      {growth.currentStage}
                    </h4>
                    <p className="text-xs text-muted-green mt-0.5 leading-relaxed">
                      {growth.stageDescription}
                    </p>
                  </div>
                </div>

                {/* Progress Bar through Crop Lifecycle */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-deep-charcoal mb-2 flex-wrap gap-2">
                    <span className="flex items-center gap-1.5">
                      <span>{t('cropPlanning.cycleProgress', 'Crop Cycle Progress')}</span>
                      <span className="text-muted-green font-normal">
                        (~{growth.daysSincePlanting} / {growth.totalEstimatedDays} {t('cropPlanning.days', 'Days')})
                      </span>
                    </span>
                    <span className="text-forest-green font-bold">{growth.progressPercentage}%</span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-soft-cream border border-border-green overflow-hidden">
                    <div
                      className="h-full bg-forest-green rounded-full transition-all duration-700"
                      style={{ width: `${growth.progressPercentage}%` }}
                    />
                  </div>

                  {/* Stage Milestones */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 text-center">
                    {growth.allStages?.map((stage, idx) => {
                      const isPastOrCurrent = growth.daysSincePlanting >= stage.startDay;
                      const isCurrent =
                        growth.daysSincePlanting >= stage.startDay &&
                        growth.daysSincePlanting <= stage.endDay;

                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border text-xs transition-all ${
                            isCurrent
                              ? 'bg-forest-green text-white border-forest-green shadow-md scale-105'
                              : isPastOrCurrent
                              ? 'bg-light-sage/40 text-forest-green border-light-sage'
                              : 'bg-soft-cream/40 text-muted-green border-border-green'
                          }`}
                        >
                          <p className="font-bold text-[11px] truncate">{stage.name}</p>
                          <p className={`text-[10px] mt-0.5 ${isCurrent ? 'text-light-sage' : 'opacity-80'}`}>
                            {stage.startDay}-{stage.endDay}d
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-muted-green italic text-center mt-4 leading-relaxed">
                    ⚠️ {growth.estimatedNotice} {t('cropPlanning.maturationNotice', 'Actual maturation varies with ambient temperatures, soil moisture, and localized microclimates.')}
                  </p>
                </div>
              </Card>

              {/* Fertilizer History for this planted field */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-forest-green uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-fresh-green flex-shrink-0" /> {t('cropPlanning.recordedFertilizerHistory', 'Recorded Fertilizer History')}
                </h4>

                {currentField.fertilizers?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {currentField.fertilizers.map((fert, idx) => (
                      <Card key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-deep-charcoal block break-words">{fert.fertilizerName}</span>
                          <span className="text-muted-green text-[10px]">
                            {t('cropPlanning.appliedOn', 'Applied on')}: {new Date(fert.applicationDate).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge variant="success" size="sm">{t('cropPlanning.fertilizerLogged', 'Logged')}</Badge>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-4 bg-soft-cream/40 border-dashed text-center text-xs text-muted-green">
                    {t('cropPlanning.noFertilizers', 'No fertilizer applications recorded for this field yet.')}
                  </Card>
                )}
              </div>

              {/* Quick Link to AI Diagnosis for this crop */}
              <div className="p-5 rounded-2xl bg-light-sage/40 border border-light-sage flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-green text-white flex items-center justify-center flex-shrink-0">
                    🍃
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-forest-green">{t('cropPlanning.noticeDiscoloration', 'Notice foliar discoloration or leaf spotting?')}</h5>
                    <p className="text-xs text-muted-green leading-relaxed">
                      {t('cropPlanning.runDiagnosisDesc', 'Run an AI health diagnosis using an uploaded photograph of your {{crop}} leaf.', { crop: currentField.cropName })}
                    </p>
                  </div>
                </div>
                <Link to={`/analysis?fieldId=${currentField._id}`} className="flex-shrink-0 w-full sm:w-auto">
                  <Button variant="primary" size="sm" icon={ArrowRight} className="w-full sm:w-auto">
                    {t('cropPlanning.diagnoseHealthBtn', 'Diagnose Crop Health')}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CropPlanningPage;
