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
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const CropAnalysisPage = ({ onOpenAddField }) => {
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
        setError(res.data?.message || 'Diagnosis failed.');
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to complete crop health analysis. Please verify your network and try again.'
      );
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
            <ScanEye className="w-6 h-6 text-fresh-green" /> AI Crop Disease & Health Diagnosis
          </h2>
          <p className="text-xs sm:text-sm text-muted-green mt-0.5">
            Deep learning plant vision combined with your field's soil, water, and fertilizer context
          </p>
        </div>

        {/* Selected Field Dropdown */}
        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-bold text-muted-green uppercase tracking-wider mb-1">
            Target Agricultural Plot *
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
            <span className="text-muted-green block text-[10px] uppercase font-bold">Selected Plot</span>
            <span className="font-bold text-deep-charcoal truncate block">{selectedField.fieldName}</span>
          </div>
          <div>
            <span className="text-muted-green block text-[10px] uppercase font-bold">Location & DIGIPIN</span>
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
            <span className="text-muted-green block text-[10px] uppercase font-bold">Soil Type</span>
            <span className="font-semibold text-deep-charcoal truncate block">{selectedField.soilType}</span>
          </div>
          <div>
            <span className="text-muted-green block text-[10px] uppercase font-bold">Irrigation Mode</span>
            <span className="font-semibold text-deep-charcoal truncate block">{selectedField.irrigationMethod}</span>
          </div>
          <div>
            <span className="text-muted-green block text-[10px] uppercase font-bold">Registered Crop</span>
            <span className="font-bold text-forest-green truncate block">
              {selectedField.isCropPlanted ? selectedField.cropName : 'None specified'}
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
                Upload Plant Leaf or Foliage Image
              </h4>
              <p className="text-xs text-muted-green mt-1 max-w-sm leading-relaxed">
                Drag and drop your crop leaf photo here, or browse files from your computer.
                Supports JPG, JPEG, and PNG up to 10MB.
              </p>
              <Button variant="sage" size="sm" className="mt-5" icon={UploadCloud}>
                Browse Leaf Image
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
                  <h4 className="text-base font-bold font-heading text-deep-charcoal">
                    {selectedFile?.name}
                  </h4>
                  <p className="text-xs text-muted-green">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Format: {selectedFile.type}
                  </p>
                  <p className="text-xs text-deep-charcoal/80 bg-soft-cream/70 p-3 rounded-xl border border-border-green/80">
                    💡 <strong>Tip for best diagnostic accuracy:</strong> Ensure the affected leaf occupies the majority of the frame with adequate daylight lighting.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleRunDiagnosis}
                      loading={analyzing}
                      icon={ScanEye}
                    >
                      {analyzing ? 'Running Deep Learning Inference...' : 'Run AI Diagnosis'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetImage}
                      disabled={analyzing}
                      icon={RefreshCw}
                    >
                      Change Photo
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
            <div className="flex items-center justify-between border-b border-border-green pb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-forest-green text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h3 className="text-base font-bold font-heading text-forest-green">
                  Section 1: AI Image Classification Results
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
                    <Badge variant={report.section1.confidence.replace('%', '') > 70 ? 'success' : 'warning'} size="sm">
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
                      Predicted Condition
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
                  <h4 className="text-2xl font-extrabold font-heading text-deep-charcoal">
                    {report.section1.predictedCondition}
                  </h4>
                  <p className="text-xs text-fresh-green font-semibold mt-0.5">
                    {report.section1.statusLabel}
                  </p>
                </div>

                {/* Confidence Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-deep-charcoal">Model Confidence Score:</span>
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
                  <p className="font-semibold text-forest-green mb-1">Botanical Profile & Lesion Description:</p>
                  <p>{report.section1.conditionDescription}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* ============================================================== */}
          {/* SECTION 2: POSSIBLE CONTRIBUTING FACTORS (STANDOUT FEATURE) */}
          {/* ============================================================== */}
          <Card className="p-6 bg-white border-2 border-border-green space-y-6">
            <div className="flex items-center justify-between border-b border-border-green pb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-fresh-green text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="text-base font-bold font-heading text-forest-green">
                  Section 2: Possible Contributing Factors (Context-Aware Synthesis)
                </h3>
              </div>
              <Badge variant="warning" size="sm">
                Possible Factors • Not Confirmed Causes
              </Badge>
            </div>

            <p className="text-xs text-muted-green leading-relaxed">
              FarmShield combines the detected leaf pathology with your field's environmental records,
              irrigation delivery, fertilization timeline, and soil profile to highlight potential agronomic triggers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Environmental / Weather */}
              <div className="p-4 rounded-2xl bg-soft-cream/60 border border-border-green space-y-1.5">
                <h5 className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-fresh-green" /> Environmental & Meteorological Conditions
                </h5>
                <p className="text-xs text-deep-charcoal/90 leading-relaxed">
                  {report.contributingFactors.environmental}
                </p>
              </div>

              {/* Water Management */}
              <div className="p-4 rounded-2xl bg-soft-cream/60 border border-border-green space-y-1.5">
                <h5 className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-fresh-green" /> Water Management & Irrigation Mode
                </h5>
                <p className="text-xs text-deep-charcoal/90 leading-relaxed">
                  {report.contributingFactors.waterManagement}
                </p>
              </div>

              {/* Fertilizer History */}
              <div className="p-4 rounded-2xl bg-soft-cream/60 border border-border-green space-y-1.5">
                <h5 className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-fresh-green" /> Fertilizer Application History
                </h5>
                <p className="text-xs text-deep-charcoal/90 leading-relaxed">
                  {report.contributingFactors.fertilizerHistory}
                </p>
              </div>

              {/* Growth Stage & Soil */}
              <div className="p-4 rounded-2xl bg-soft-cream/60 border border-border-green space-y-1.5">
                <h5 className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-fresh-green" /> Growth Stage & Soil Morphology
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
              <span className="w-6 h-6 rounded-lg bg-forest-green text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="text-base font-bold font-heading text-forest-green">
                Section 3: Personalized Field Precautions & Safe Management
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
              <span className="w-6 h-6 rounded-lg bg-forest-green text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h3 className="text-base font-bold font-heading text-forest-green">
                Section 4: Actionable Next Steps & Expert Consultation
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
                  Agronomic Extension Consultation Guideline
                </h5>
                <p className="text-xs text-[#945C0B] mt-1 leading-relaxed">
                  {report.expertConsultation}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CropAnalysisPage;
