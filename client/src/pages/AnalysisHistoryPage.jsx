import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  History,
  ScanEye,
  Calendar,
  Trees,
  ArrowRight,
  ExternalLink,
  BrainCircuit,
  Eye,
  CheckCircle2,
  AlertTriangle,
  CloudSun,
  Droplets,
  Layers,
  Sprout,
  X,
} from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

const AnalysisHistoryPage = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [advisoryDetails, setAdvisoryDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analysis/history');
      if (res.data?.success) {
        setHistory(res.data.history || []);
      }
    } catch (err) {
      console.error('Failed to load analysis history:', err);
      setError(t('history.loadError', 'Failed to load your previous crop health analyses.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenReport = async (item) => {
    try {
      setSelectedAnalysis(item);
      setLoadingDetails(true);
      const res = await api.get(`/analysis/${item._id}`);
      if (res.data?.success) {
        setAdvisoryDetails(res.data);
      }
    } catch (err) {
      console.error('Failed to load report details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text={t('history.loadingRecords', 'Loading historical diagnostic records...')} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border-green">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-forest-green flex items-center gap-2">
            <History className="w-6 h-6 text-fresh-green flex-shrink-0" /> {t('history.title', 'Crop Health Analysis History')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-green mt-0.5 leading-relaxed">
            {t('history.subtitle', 'Audit trail of all previous computer vision scans, predicted conditions, and context-aware advisories')}
          </p>
        </div>

        <Link to="/analysis" className="w-full sm:w-auto">
          <Button variant="primary" size="md" icon={ScanEye} className="w-full sm:w-auto">
            {t('cropAnalysis.btnNewScan', 'New Leaf Diagnosis')}
          </Button>
        </Link>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* History Table / Cards */}
      {history.length === 0 ? (
        <Card className="p-12 text-center bg-soft-cream/40 border-dashed">
          <History className="w-12 h-12 text-muted-green mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-deep-charcoal">{t('history.emptyTitle', 'No Analysis Records Found')}</h3>
          <p className="text-xs text-muted-green mt-1 max-w-md mx-auto mb-5 leading-relaxed">
            {t('history.emptyDesc', 'Perform your first leaf scan on the AI Disease Diagnosis page to start building your farm health history.')}
          </p>
          <Link to="/analysis">
            <Button variant="primary" icon={ScanEye}>
              {t('cropAnalysis.btnRunAnalysis', 'Start AI Diagnosis')}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => {
            const isHealthy = item.predictedCondition.toLowerCase().includes('healthy');
            const conditionKey = item.predictedCondition ? `conditions.${item.predictedCondition.replace(/ /g, '_')}` : '';
            const localizedCondition = conditionKey ? t(conditionKey, item.predictedCondition) : item.predictedCondition;

            return (
              <Card
                key={item._id}
                hover
                className="p-0 overflow-hidden flex flex-col justify-between border-2 border-border-green hover:border-fresh-green transition-all shadow-sm"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="h-44 relative bg-soft-cream overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt="Analyzed Crop Leaf"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <Badge
                        variant={isHealthy ? 'success' : item.predictionStatus === 'uncertain' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {item.confidence}% {t('history.colConfidence', 'Confidence')}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="font-bold text-base text-deep-charcoal font-heading break-words">
                        {localizedCondition}
                      </h4>
                      <p className="text-xs text-forest-green font-medium flex items-center gap-1.5 mt-0.5">
                        <Trees className="w-3.5 h-3.5 text-fresh-green flex-shrink-0" />
                        {t('history.colField', 'Plot')}: {item.fieldId?.fieldName || t('fields.registeredField', 'Registered Field')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-green pt-2 border-t border-border-green/80 flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        {new Date(item.analysisDate).toLocaleDateString()}
                      </span>
                      <span className="text-[11px] font-semibold text-deep-charcoal">
                        {item.modelName?.split('-')[0] || 'DINOv2'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Button
                    variant="sage"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => handleOpenReport(item)}
                    icon={Eye}
                  >
                    <span>{t('history.btnViewReport', 'View Full Report')}</span>
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detailed Report Modal */}
      <Modal
        isOpen={!!selectedAnalysis}
        onClose={() => {
          setSelectedAnalysis(null);
          setAdvisoryDetails(null);
        }}
        title={t('cropAnalysis.resultsTitle', 'Complete Crop Health & Context-Aware Advisory Report')}
        subtitle={`${t('history.colDiagnosis', 'Diagnostic Record')} #${selectedAnalysis?._id?.slice(-8)}`}
        maxWidth="max-w-3xl"
      >
        {loadingDetails ? (
          <LoadingSpinner text={t('history.retrieving', 'Retrieving comprehensive diagnostic report and advisory notes...')} />
        ) : advisoryDetails ? (
          <div className="space-y-6">
            {/* Header Summary Strip */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-forest-green text-white">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white flex-shrink-0 bg-white/10">
                <img
                  src={advisoryDetails.analysis?.imageUrl}
                  alt="Scanned specimen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <Badge variant="success" size="sm" className="bg-light-sage text-forest-green mb-1">
                  {t('history.colConfidence', 'Confidence')}: {advisoryDetails.analysis?.confidence}%
                </Badge>
                <h4 className="text-lg font-bold font-heading break-words">
                  {advisoryDetails.analysis?.predictedCondition ? t(`conditions.${advisoryDetails.analysis.predictedCondition.replace(/ /g, '_')}`, advisoryDetails.analysis.predictedCondition) : ''}
                </h4>
                <p className="text-xs text-light-sage/90 mt-0.5 leading-relaxed">
                  {t('history.colField', 'Field')}: {advisoryDetails.field?.fieldName || t('fields.registeredField', 'Registered Plot')} • {t('cropPlanning.appliedOn', 'Analyzed on')}:{' '}
                  {new Date(advisoryDetails.analysis?.analysisDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Contributing Factors (Section 2) */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-forest-green uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-fresh-green flex-shrink-0" /> {t('cropAnalysis.sec2Title', 'Possible Contributing Factors')}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-soft-cream border border-border-green">
                  <span className="font-bold text-deep-charcoal block mb-0.5">{t('cropAnalysis.factorEnv', 'Environmental')}:</span>
                  <span className="text-muted-green leading-relaxed block">
                    {advisoryDetails.advisory?.contributingFactors?.environmental || t('history.seasonalNormal', 'Regional seasonal patterns recorded.')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-soft-cream border border-border-green">
                  <span className="font-bold text-deep-charcoal block mb-0.5">{t('cropAnalysis.factorWater', 'Water Management')}:</span>
                  <span className="text-muted-green leading-relaxed block">
                    {advisoryDetails.advisory?.contributingFactors?.waterManagement || t('history.standardIrrigation', 'Standard irrigation.')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-soft-cream border border-border-green">
                  <span className="font-bold text-deep-charcoal block mb-0.5">{t('cropAnalysis.factorFertilizer', 'Fertilizer History')}:</span>
                  <span className="text-muted-green leading-relaxed block">
                    {advisoryDetails.advisory?.contributingFactors?.fertilizerHistory || t('history.nutrientLogged', 'Nutrient review logged.')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-soft-cream border border-border-green">
                  <span className="font-bold text-deep-charcoal block mb-0.5">{t('cropAnalysis.factorStageSoil', 'Growth & Soil')}:</span>
                  <span className="text-muted-green leading-relaxed block">
                    {advisoryDetails.advisory?.contributingFactors?.growthStage || ''}{' '}
                    {advisoryDetails.advisory?.contributingFactors?.soilConsiderations || ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Precautions (Section 3) */}
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-forest-green uppercase tracking-wider">
                {t('cropAnalysis.sec3Title', 'Personalized Precautions')}
              </h5>
              <div className="space-y-1.5">
                {advisoryDetails.advisory?.precautions?.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-light-sage/20 border border-light-sage text-xs">
                    <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps (Section 4) */}
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-forest-green uppercase tracking-wider">
                {t('cropAnalysis.sec4Title', 'Recommended Next Steps')}
              </h5>
              <div className="space-y-1.5">
                {advisoryDetails.advisory?.recommendedNextSteps?.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-soft-cream border border-border-green text-xs">
                    <span className="w-4 h-4 rounded-full bg-forest-green text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expert Consultation */}
            {advisoryDetails.advisory?.expertConsultation && (
              <div className="p-3.5 rounded-xl bg-[#FCF7ED] border border-[#F7E2BF] text-xs text-[#945C0B]">
                <strong className="block mb-1">{t('cropAnalysis.expertGuideline', 'Agronomist Consultation')}:</strong>
                <p className="leading-relaxed">{advisoryDetails.advisory?.expertConsultation}</p>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default AnalysisHistoryPage;

