import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ScanEye,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  BrainCircuit,
  Trees,
  Sprout,
  Droplets,
  Layers,
  CloudSun,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  FileText,
  UserCheck,
  Compass,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const CropAnalysisPage = ({ onOpenAddField }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const preselectedFieldId = searchParams.get('fieldId');

  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(preselectedFieldId || '');
  const [loadingFields, setLoadingFields] = useState(true);

  // Upload & Inference States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // Results State
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);

  // 1. Fetch farmer's fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoadingFields(true);
        const res = await api.get('/fields');
        if (res.data?.success) {
          const list = res.data.fields || [];
          setFields(list);
          if (preselectedFieldId && list.some((f) => f._id === preselectedFieldId)) {
            setSelectedFieldId(preselectedFieldId);
          } else if (list.length > 0 && !selectedFieldId) {
            setSelectedFieldId(list[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load fields:', err);
        setError('Failed to retrieve registered fields.');
      } finally {
        setLoadingFields(false);
      }
    };
    fetchFields();
  }, [preselectedFieldId]);

  // Clean up preview object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    setError('');
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null); // Reset previous result
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleResetImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRunDiagnosis = async () => {
    if (!selectedFieldId) {
      setError('Please select a registered field to associate with this diagnosis.');
      return;
    }
    if (!selectedFile) {
      setError('Please upload an image of the plant leaf or affected foliage.');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');

      const formData = new FormData();
      formData.append('fieldId', selectedFieldId);
      formData.append('image', selectedFile);

      const res = await api.post('/analysis/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        setResult(res.data);
      } else {
        setError(res.data?.message || 'AI disease classification is temporarily unavailable. Please try again later.');
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
      const serverMsg = err.response?.data?.message;
      if (err.response?.status === 503) {
        setError('AI disease classification is temporarily unavailable. Please try again later.');
      } else {
        setError(serverMsg || 'AI disease classification is temporarily unavailable. Please try again later.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingFields) {
    return <LoadingSpinner text="Loading your agricultural diagnostic workspace..." />;
  }

  if (fields.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-heading text-forest-green flex items-center gap-2">
          <ScanEye className="w-6 h-6 text-fresh-green" /> AI Crop Health & Disease Analysis
        </h2>
        <Card className="p-12 text-center bg-soft-cream/40 border-dashed">
          <Trees className="w-12 h-12 text-muted-green mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-deep-charcoal">Field Registration Required</h3>
          <p className="text-xs text-muted-green mt-1 max-w-md mx-auto mb-5">
            FarmShield's standout Context-Aware Advisory synthesizes AI vision with your registered field's
            soil type, irrigation, and fertilizer history. You must register at least one field first.
          </p>
          <Button onClick={onOpenAddField} variant="primary" icon={Trees}>
            Register a Field Now
          </Button>
        </Card>
      </div>
    );
  }

  const selectedField = fields.find((f) => f._id === selectedFieldId);
  const report = result?.report;
  const analysis = result?.analysis;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border-green">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-forest-green flex items-center gap-2">
            <ScanEye className="w-6 h-6 text-fresh-green flex-shrink-0" />
            <span>{t('cropAnalysis.title')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-green mt-0.5">
            {t('cropAnalysis.subtitle')}
          </p>
        </div>

        {/* Selected Field Dropdown */}
        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-bold text-muted-green uppercase tracking-wider mb-1">
            {t('cropPlanning.selectFieldPrompt')} *
          </label>
          <select
            value={selectedFieldId}
            onChange={(e) => setSelectedFieldId(e.target.value)}
            disabled={analyzing}
            className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-border-green focus:border-forest-green bg-white shadow-sm"
          >
            {fields.map((f) => (
              <option key={f._id} value={f._id}>
                {f.fieldName} ({f.cropName || 'Unplanted'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Selected Field Context Strip */}
      {selectedField && (
        <div className="p-4 rounded-2xl bg-white border border-border-green shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-muted-green block text-[10px] uppercase font-bold">{t('cropPlanning.selectFieldPrompt')}</span>
            <span className="font-bold text-deep-charcoal truncate block">{selectedField.fieldName}</span>
          </div>
          <div>
            <span className="text-muted-green block text-[10px] uppercase font-bold">{t('fields.cardDigipin')}</span>
            <span className="font-semibold text-deep-charcoal truncate block">
              {selectedField.village}, {selectedField.district}
            </span>
            {selectedField.digipin && (
              <span className="text-[10px] font-mono font-bold text-forest-green block truncate">
                {selectedField.digipin}
              </span>
            )}
          </div>
          <div>
            <span className="text-muted-green block text-[10px] uppercase font-bold">{t('fields.cardSoil')}</span>
            <span className="font-semibold text-deep-charcoal truncate block">{selectedField.soilType}</span>
          </div>
          <div>
            <span className="text-muted-green block text-[10px] uppercase font-bold">{t('fields.cardWater')}</span>
            <span className="font-semibold text-deep-charcoal truncate block">{selectedField.irrigationMethod}</span>
          </div>
          <div>
            <span className="text-muted-green block text-[10px] uppercase font-bold">{t('fields.cardCrop')}</span>
            <span className="font-bold text-forest-green truncate block">
              {selectedField.isCropPlanted ? selectedField.cropName : t('common.notAvailable')}
            </span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* IMAGE UPLOAD & PREVIEW SECTION */}
      {/* ============================================================== */}
      {!result && (
        <Card className="p-8 bg-white border-2 border-dashed border-border-green hover:border-fresh-green transition-all">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files[0])}
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
          />

          {!previewUrl ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center text-center cursor-pointer py-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-light-sage/50 text-forest-green flex items-center justify-center mb-4 transition-transform hover:scale-110">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold font-heading text-deep-charcoal">
                {t('cropAnalysis.step2Title')}
              </h4>
              <p className="text-xs text-muted-green mt-1 max-w-sm leading-relaxed">
                {t('cropAnalysis.dropPrompt')}. {t('cropAnalysis.formatSupport')}
              </p>
              <Button variant="sage" size="sm" className="mt-5" icon={UploadCloud}>
                {t('cropAnalysis.chooseFileBtn')}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
                <div className="w-64 h-64 rounded-2xl overflow-hidden border-2 border-forest-green/20 shadow-md relative bg-soft-cream flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt="Uploaded Leaf Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                    Ready for AI
                  </div>
                </div>

                <div className="space-y-3 max-w-md text-left">
                  <Badge variant="success" size="sm">Image Ready for Diagnosis</Badge>
                  <h4 className="text-base font-bold font-heading text-deep-charcoal break-words">
                    {selectedFile?.name}
                  </h4>
                  <p className="text-xs text-muted-green">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Format: {selectedFile.type}
                  </p>
                  <p className="text-xs text-deep-charcoal/80 bg-soft-cream/70 p-3 rounded-xl border border-border-green/80 leading-relaxed">
                    💡 <strong>Tip:</strong> Ensure the affected leaf occupies the majority of the frame with adequate natural daylight lighting.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleRunDiagnosis}
                      loading={analyzing}
                      icon={ScanEye}
                      className="flex-shrink-0"
                    >
                      {analyzing ? t('cropAnalysis.analyzingPrompt') : t('cropAnalysis.btnRunAnalysis')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetImage}
                      disabled={analyzing}
                      icon={RefreshCw}
                      className="flex-shrink-0"
                    >
                      {t('common.refresh')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* LOADING OVERLAY WHEN INFERENCING */}
      {analyzing && (
        <Card className="p-10 text-center bg-white space-y-4 shadow-lg border-2 border-fresh-green">
          <LoadingSpinner text="Executing Computer Vision Inference (PlantVillage ONNX Model)..." size="lg" />
          <p className="text-xs text-muted-green max-w-md mx-auto">
            Extracting leaf lamina texture, checking botanical chlorophyll variance, and synthesizing with field agronomic parameters...
          </p>
        </Card>
      )}

      {/* ============================================================== */}
      {/* MODULE 3 & 4: RESULTS REPORT & CONTEXT-AWARE ADVISORY */}
      {/* ============================================================== */}
      {result && report && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Action Strip */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-forest-green text-white shadow-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-light-sage" />
              <div>
                <h3 className="text-base font-bold font-heading">
                  Diagnosis Complete & Advisory Generated
                </h3>
                <p className="text-xs text-light-sage/90">
                  Record saved to your permanent agricultural analysis history
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="sage"
                size="sm"
                onClick={handleResetImage}
                icon={RefreshCw}
              >
                New Analysis
              </Button>
              <Link to="/history">
                <Button variant="secondary" size="sm" icon={ArrowRight}>
                  View History
                </Button>
              </Link>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 1: AI PREDICTION */}
          {/* ============================================================== */}
          <Card className="p-6 bg-white border-2 border-border-green space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-green pb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-forest-green text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  1
                </span>
                <h3 className="text-base font-bold font-heading text-forest-green">
                  {t('cropAnalysis.sec1Title')}
                </h3>
              </div>
              <Badge variant="default" size="sm">
                Model: {report.section1.modelName}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Image Thumbnail */}
              <div className="md:col-span-4">
                <div className="w-full h-56 rounded-2xl overflow-hidden border-2 border-border-green shadow-sm relative bg-soft-cream">
                  <img
                    src={analysis.imageUrl}
                    alt="Analyzed Leaf"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm p-2 rounded-xl text-white text-[11px] flex justify-between items-center">
                    <span>Analyzed Specimen</span>
                    <Badge variant={Number(report.section1.confidence.replace('%', '')) > 70 ? 'success' : 'warning'} size="sm">
                      {report.section1.confidence} Conf.
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Diagnosis Details */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-green uppercase tracking-wider">
                      {t('cropAnalysis.predictedCondition')}
                    </span>
                    <Badge
                      variant={
                        report.section1.predictedCondition.toLowerCase().includes('healthy')
                          ? 'success'
                          : report.section1.predictionStatus === 'uncertain'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                      dot
                    >
                      {report.section1.predictionStatus === 'uncertain' ? 'Review Recommended' : 'Classified'}
                    </Badge>
                  </div>
                  <h4 className="text-2xl font-extrabold font-heading text-deep-charcoal leading-snug break-words">
                    {t(`conditions.${report.section1.predictedCondition}`, report.section1.predictedCondition)}
                  </h4>
                  <p className="text-xs text-fresh-green font-semibold mt-0.5">
                    {report.section1.statusLabel}
                  </p>
                </div>

                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-deep-charcoal">{t('cropAnalysis.modelScore')}</span>
                    <span className="text-forest-green font-bold">{report.section1.confidence}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-soft-cream border border-border-green overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        Number(report.section1.confidence.replace('%', '')) > 80
                          ? 'bg-forest-green'
                          : 'bg-warning-amber'
                      }`}
                      style={{ width: report.section1.confidence }}
                    />
                  </div>
                </div>

                {/* Botanical Condition Description */}
                <div className="p-3.5 rounded-xl bg-soft-cream/70 border border-border-green/80 text-xs text-deep-charcoal leading-relaxed">
                  <p className="font-semibold text-forest-green mb-1">{t('cropAnalysis.botanicalProfile')}</p>
                  <p>{report.section1.conditionDescription}</p>
                </div>

                {/* Out-Of-Distribution (Non-Leaf) Warning */}
                {report.section1.isOutOfDistribution && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{t('cropAnalysis.oodTitle')}</p>
                      <p className="mt-0.5 text-amber-800 leading-relaxed">
                        {t('cropAnalysis.oodDesc', { sim: report.section1.centroidSimilarity || 'low' })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Top 3 Diagnostic Candidates */}
                {report.section1.topPredictions && report.section1.topPredictions.length > 0 && (
                  <div className="pt-3 border-t border-border-green/80 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-deep-charcoal">
                      <span className="uppercase tracking-wider text-[11px] text-muted-green">{t('cropAnalysis.top3Title')}</span>
                      <span className="text-[10px] text-muted-green font-normal">{t('cropAnalysis.top3Sub')}</span>
                    </div>
                    <div className="space-y-1.5">
                      {report.section1.topPredictions.map((pred, pIdx) => (
                        <div key={pIdx} className="p-2.5 rounded-xl bg-soft-cream/60 border border-border-green/60 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-deep-charcoal">
                              {pIdx + 1}. {t(`crops.${pred.crop}`, pred.crop)} — {t(`conditions.${pred.condition}`, pred.condition)}
                            </span>
                            <span className="font-bold text-forest-green">{pred.confidence}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-border-green/40 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${pIdx === 0 ? 'bg-forest-green' : 'bg-muted-green/60'}`}
                              style={{ width: `${Math.max(1, Math.min(100, pred.confidence))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* ============================================================== */}
          {/* SECTION 2: POSSIBLE CONTRIBUTING FACTORS */}
          {/* ============================================================== */}
          <Card className="p-6 bg-white border-2 border-border-green space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-green pb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-fresh-green text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  2
                </span>
                <h3 className="text-base font-bold font-heading text-forest-green">
                  {t('cropAnalysis.sec2Title')}
                </h3>
              </div>
              <Badge variant="warning" size="sm">
                {t('cropAnalysis.sec2Badge')}
              </Badge>
            </div>

            <p className="text-xs text-muted-green leading-relaxed">
              {t('cropAnalysis.sec2Desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Environmental / Weather */}
              <div className="p-4 rounded-2xl bg-soft-cream/60 border border-border-green space-y-1.5">
                <h5 className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropAnalysis.factorEnv')}</span>
                </h5>
                <p className="text-xs text-deep-charcoal/90 leading-relaxed">
                  {report.contributingFactors.environmental}
                </p>
              </div>

              {/* Water Management */}
              <div className="p-4 rounded-2xl bg-soft-cream/60 border border-border-green space-y-1.5">
                <h5 className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropAnalysis.factorWater')}</span>
                </h5>
                <p className="text-xs text-deep-charcoal/90 leading-relaxed">
                  {report.contributingFactors.waterManagement}
                </p>
              </div>

              {/* Fertilizer History */}
              <div className="p-4 rounded-2xl bg-soft-cream/60 border border-border-green space-y-1.5">
                <h5 className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropAnalysis.factorFertilizer')}</span>
                </h5>
                <p className="text-xs text-deep-charcoal/90 leading-relaxed">
                  {report.contributingFactors.fertilizerHistory}
                </p>
              </div>

              {/* Growth Stage & Soil */}
              <div className="p-4 rounded-2xl bg-soft-cream/60 border border-border-green space-y-1.5">
                <h5 className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropAnalysis.factorStageSoil')}</span>
                </h5>
                <p className="text-xs text-deep-charcoal/90 leading-relaxed">
                  {report.contributingFactors.growthStage} {report.contributingFactors.soilConsiderations}
                </p>
              </div>
            </div>
          </Card>

          {/* ============================================================== */}
          {/* SECTION 3: PERSONALIZED PRECAUTIONS */}
          {/* ============================================================== */}
          <Card className="p-6 bg-white border-2 border-border-green space-y-4">
            <div className="flex items-center gap-2 border-b border-border-green pb-4">
              <span className="w-6 h-6 rounded-lg bg-forest-green text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                3
              </span>
              <h3 className="text-base font-bold font-heading text-forest-green">
                {t('cropAnalysis.sec3Title')}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.precautions.map((precaution, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-light-sage/20 border border-light-sage/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-deep-charcoal leading-relaxed">{precaution}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* ============================================================== */}
          {/* SECTION 4: RECOMMENDED NEXT STEPS & EXPERT CONSULTATION */}
          {/* ============================================================== */}
          <Card className="p-6 bg-white border-2 border-border-green space-y-5">
            <div className="flex items-center gap-2 border-b border-border-green pb-4">
              <span className="w-6 h-6 rounded-lg bg-forest-green text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                4
              </span>
              <h3 className="text-base font-bold font-heading text-forest-green">
                {t('cropAnalysis.sec4Title')}
              </h3>
            </div>

            <div className="space-y-2.5">
              {report.recommendedNextSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-soft-cream/60 border border-border-green"
                >
                  <span className="w-5 h-5 rounded-full bg-forest-green text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-deep-charcoal leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {/* Expert Agronomist Advisory Notice */}
            <div className="p-4 rounded-2xl bg-[#FCF7ED] border border-[#F7E2BF] flex items-start gap-3.5">
              <UserCheck className="w-5 h-5 text-warning-amber flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-[#945C0B] uppercase tracking-wider">
                  {t('cropAnalysis.expertGuideline')}
                </h5>
                <p className="text-xs text-[#945C0B] mt-1 leading-relaxed">
                  {report.expertConsultation}
                </p>
              </div>
            </div>
          </Card>

          {/* ============================================================== */}
          {/* MODEL ATTRIBUTION, LICENSING & AGRONOMIC DISCLAIMER */}
          {/* ============================================================== */}
          <div className="p-4 rounded-2xl bg-soft-cream/60 border border-border-green/80 text-[11px] text-muted-green space-y-1.5 leading-relaxed">
            <div className="flex flex-wrap items-center justify-between gap-2 text-deep-charcoal font-semibold">
              <span className="flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-forest-green flex-shrink-0" />
                <span>{t('cropAnalysis.attributionTitle')}</span>
              </span>
              <span className="text-[11px] bg-light-sage/30 text-forest-green px-2 py-0.5 rounded font-medium flex-shrink-0">
                {t('cropAnalysis.licenseBadge')}
              </span>
            </div>
            <p className="leading-relaxed">
              {t('cropAnalysis.attributionText')}
            </p>
            <p className="text-[10px] text-muted-green/80 italic leading-relaxed">
              {t('cropAnalysis.disclaimerText')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAnalysisPage;
