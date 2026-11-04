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
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const DashboardPage = ({ onOpenAddField }) => {
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
    return <LoadingSpinner text="Loading your agricultural intelligence dashboard..." />;
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
    <div className="space-y-8">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* STATISTICS CARDS (Fetched from actual DB) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Fields */}
        <Card hover className="p-5 flex items-center justify-between border-l-4 border-l-forest-green">
          <div>
            <p className="text-xs font-semibold text-muted-green uppercase tracking-wider">
              Registered Fields
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal mt-1">
              {stats.totalFields}
            </h3>
            <p className="text-[11px] text-muted-green mt-1 flex items-center gap-1">
              <span>Managed parcels</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-light-sage/60 text-forest-green flex items-center justify-center">
            <Trees className="w-6 h-6" />
          </div>
        </Card>

        {/* Stat 2: Total Cultivated Area */}
        <Card hover className="p-5 flex items-center justify-between border-l-4 border-l-fresh-green">
          <div>
            <p className="text-xs font-semibold text-muted-green uppercase tracking-wider">
              Total Cultivated Area
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal mt-1">
              {stats.totalAreaAcres}{' '}
              <span className="text-sm font-semibold text-muted-green">Acres</span>
            </h3>
            <p className="text-[11px] text-muted-green mt-1">Aggregate farm acreage</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-light-sage/60 text-fresh-green flex items-center justify-center">
            <Maximize2 className="w-6 h-6" />
          </div>
        </Card>

        {/* Stat 3: Planted Crops */}
        <Card hover className="p-5 flex items-center justify-between border-l-4 border-l-warning-amber">
          <div>
            <p className="text-xs font-semibold text-muted-green uppercase tracking-wider">
              Planted Crops
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal mt-1">
              {stats.plantedCropsCount}
            </h3>
            <p className="text-[11px] text-muted-green mt-1">Active crop cycles</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FCF7ED] text-warning-amber flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
        </Card>

        {/* Stat 4: Total Analyses */}
        <Card hover className="p-5 flex items-center justify-between border-l-4 border-l-[#205799]">
          <div>
            <p className="text-xs font-semibold text-muted-green uppercase tracking-wider">
              Health Analyses
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal mt-1">
              {stats.totalAnalyses}
            </h3>
            <p className="text-[11px] text-muted-green mt-1">AI diagnoses executed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F1FC] text-[#205799] flex items-center justify-center">
            <ScanEye className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* QUICK LAUNCH BANNER IF ZERO FIELDS (EMPTY STATE) */}
      {stats.totalFields === 0 && (
        <div className="bg-gradient-to-r from-forest-green to-[#235841] rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <Badge variant="default" size="sm" className="bg-light-sage text-forest-green">
              Get Started with FarmShield
            </Badge>
            <h3 className="text-2xl font-bold font-heading">
              Register Your First Agricultural Field
            </h3>
            <p className="text-sm text-white/80 max-w-xl">
              Add your plot's soil type, irrigation, and area to unlock personalized crop planning
              and context-aware disease diagnoses.
            </p>
          </div>
          <Button
            onClick={onOpenAddField}
            variant="secondary"
            size="lg"
            icon={Plus}
            className="flex-shrink-0"
          >
            Register Field Now
          </Button>
        </div>
      )}

      {/* MAIN TWO-COLUMN DASHBOARD SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): My Recent Fields & Crop Recommendations */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 1: MY RECENT FIELDS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                  <Trees className="w-5 h-5 text-fresh-green" /> My Recent Fields
                </h3>
                <p className="text-xs text-muted-green">
                  Quick view of your active parcels and current crop growth
                </p>
              </div>
              <Link to="/fields" className="text-xs font-semibold text-forest-green hover:text-fresh-green flex items-center gap-1">
                View All Fields <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentFields.length === 0 ? (
              <Card className="p-8 text-center bg-soft-cream/40 border-dashed">
                <Trees className="w-10 h-10 text-muted-green mx-auto mb-3 opacity-60" />
                <h4 className="text-sm font-semibold text-deep-charcoal">No Fields Registered Yet</h4>
                <p className="text-xs text-muted-green mt-1 mb-4">
                  Register your agricultural plots to begin tracking crop lifecycle and receiving guidance.
                </p>
                <Button onClick={onOpenAddField} variant="primary" size="sm" icon={Plus}>
                  Add Your First Field
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentFields.map((field) => (
                  <Card key={field._id} hover className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-sm text-deep-charcoal font-heading truncate">
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
                          <span className="text-muted-green">Area:</span>
                          <span className="font-medium">{field.area} {field.areaUnit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-green">Soil:</span>
                          <span className="font-medium">{field.soilType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-green">Irrigation:</span>
                          <span className="font-medium">{field.irrigationMethod}</span>
                        </div>
                        {field.isCropPlanted && (
                          <div className="flex justify-between text-forest-green font-semibold pt-1 border-t border-border-green/60">
                            <span>Crop:</span>
                            <span>{field.cropName} {field.cropVariety ? `(${field.cropVariety})` : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-green/80 flex items-center justify-between text-xs">
                      {field.isCropPlanted ? (
                        <Link
                          to={`/crops?fieldId=${field._id}`}
                          className="font-semibold text-forest-green hover:underline flex items-center gap-1"
                        >
                          Growth Stage <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          to={`/crops?fieldId=${field._id}`}
                          className="font-semibold text-fresh-green hover:underline flex items-center gap-1"
                        >
                          Plan Recommended Crops <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      <Link
                        to={`/analysis?fieldId=${field._id}`}
                        className="text-xs text-muted-green hover:text-forest-green font-medium flex items-center gap-1"
                      >
                        <ScanEye className="w-3.5 h-3.5" /> Diagnose
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: CROP RECOMMENDATIONS PREVIEW */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-fresh-green" /> Smart Crop Recommendations
                </h3>
                <p className="text-xs text-muted-green">
                  Agronomic suitability matching regional soil, current season, and water availability
                </p>
              </div>
              <Link to="/crops" className="text-xs font-semibold text-forest-green hover:text-fresh-green flex items-center gap-1">
                Explore All Recommendations <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <Card key={idx} hover className="overflow-hidden p-0 flex flex-col justify-between">
                  <div className="h-32 relative overflow-hidden bg-forest-green/10">
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
                      <h4 className="font-bold text-sm text-deep-charcoal font-heading">
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
        <div className="lg:col-span-4 space-y-8">
          {/* SECTION 3: RECENT CROP ANALYSES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                <ScanEye className="w-5 h-5 text-fresh-green" /> Recent Analyses
              </h3>
              <Link to="/history" className="text-xs font-semibold text-forest-green hover:text-fresh-green">
                History
              </Link>
            </div>

            {recentAnalyses.length === 0 ? (
              <Card className="p-6 text-center bg-soft-cream/40 border-dashed">
                <ScanEye className="w-8 h-8 text-muted-green mx-auto mb-2 opacity-60" />
                <p className="text-xs text-muted-green">No AI crop analyses executed yet.</p>
                <Link to="/analysis" className="inline-block mt-3">
                  <Button variant="sage" size="sm" icon={ScanEye}>
                    Diagnose Leaf
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
                          Field: {analysis.fieldId?.fieldName || 'Registered Field'}
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
              <h3 className="text-lg font-bold font-heading text-forest-green flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-fresh-green" /> Recent Advisories
              </h3>
            </div>

            {recentAdvisories.length === 0 ? (
              <Card className="p-6 text-center bg-soft-cream/40 border-dashed">
                <BrainCircuit className="w-8 h-8 text-muted-green mx-auto mb-2 opacity-60" />
                <p className="text-xs text-muted-green">
                  Context-aware advisories are generated alongside each crop disease diagnosis.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentAdvisories.map((item, idx) => (
                  <Card key={idx} className="p-4 bg-gradient-to-br from-white to-light-sage/20 border-light-sage space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-fresh-green" />
                        {item.analysis?.predictedCondition?.split('(')[0]}
                      </span>
                      <span className="text-[10px] text-muted-green">
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
                        Field: {item.analysis?.fieldId?.fieldName || 'Registered'}
                      </span>
                      <Link
                        to={`/history`}
                        className="font-semibold text-forest-green hover:underline flex items-center gap-1"
                      >
                        Open Advisory <ArrowRight className="w-3 h-3" />
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
