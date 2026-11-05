import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Sprout,
  ScanEye,
  BrainCircuit,
  Trees,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BarChart3,
  SunMedium,
  Droplets,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-soft-cream flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-light-sage/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-light-sage/70 border border-light-sage text-forest-green text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-fresh-green animate-pulse flex-shrink-0" />
                {t('landing.heroBadge', 'AI-Powered Smart Agriculture Platform')}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-forest-green leading-[1.2] tracking-tight">
                {t('landing.heroTitle', 'Smarter Farming Starts with Better Decisions')}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-deep-charcoal/80 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {t('landing.heroSubtitle', 'Empowering farmers with AI-powered crop health analysis, smart crop recommendations, and personalized agricultural guidance.')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md" icon={ArrowRight}>
                    {t('landing.ctaButton', 'Register Your Farm Free')}
                  </Button>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('nav.features', 'Explore Features')}
                  </Button>
                </a>
              </div>

              {/* Trust Metric Micro-bar */}
              <div className="pt-6 border-t border-border-green/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 text-xs font-medium text-muted-green">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('landing.feat1Title', 'DINOv2 Disease Classification')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('landing.feat2Title', 'Context-Aware Diagnosis')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('landing.feat3Title', 'India Post DIGIPIN Mapping')}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Beautiful agricultural field visual */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
                  <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
                    alt="Golden Sunlit Agricultural Field"
                    className="w-full h-[430px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-green/90 via-transparent to-transparent" />
                  
                  {/* Floating AI Analysis Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border-green shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-fresh-green animate-ping flex-shrink-0" />
                        <span className="text-xs font-bold text-forest-green uppercase tracking-wide">
                          {t('cropAnalysis.title', 'Live Crop Diagnosis')}
                        </span>
                      </div>
                      <Badge variant="success" size="sm">94.2% {t('history.colConfidence', 'Confidence')}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-light-sage flex items-center justify-center text-forest-green font-bold text-lg flex-shrink-0">
                        🍃
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-sm font-bold text-deep-charcoal truncate">{t('conditions.Tomato___Early_blight', 'Tomato Early Blight')}</p>
                        <p className="text-xs text-muted-green truncate">{t('cropAnalysis.sec2Badge', 'Integrated with Soil & Rainfed Context')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Badge */}
                <div className="absolute -top-4 -right-4 bg-forest-green text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 border-2 border-white">
                  <BrainCircuit className="w-6 h-6 text-light-sage flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] text-light-sage uppercase tracking-wider font-semibold">DINOv2 ONNX</p>
                    <p className="text-xs font-bold">{t('landing.feat2Title', 'Context-Aware Advisory')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-y border-border-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="default" size="sm" className="mb-3">
            {t('landing.howItWorksSubtitle', 'Transparent Workflow')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-forest-green">
            {t('landing.howItWorksTitle', 'How FarmShield Works')}
          </h2>
          <p className="mt-3 text-base text-muted-green max-w-2xl mx-auto leading-relaxed">
            {t('landing.howItWorksSubtitle', 'From field registration to AI leaf classification and field-tailored guidance in four simple steps.')}
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-forest-green group-hover:text-white transition-all duration-300 mb-5 relative flex-shrink-0">
                1
                <span className="absolute -bottom-2 text-[10px] font-semibold bg-forest-green text-white px-2 py-0.5 rounded-full group-hover:bg-fresh-green">
                  {t('common.step', 'Step')}
                </span>
              </div>
              <h3 className="text-base font-bold text-deep-charcoal mb-2 font-heading break-words">
                {t('landing.step1Title', '1. Register Your Field')}
              </h3>
              <p className="text-xs text-muted-green leading-relaxed max-w-xs">
                {t('landing.step1Desc', 'Log your plot name, location, soil type, irrigation method, and whether a crop is currently planted.')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-forest-green group-hover:text-white transition-all duration-300 mb-5 relative flex-shrink-0">
                2
                <span className="absolute -bottom-2 text-[10px] font-semibold bg-forest-green text-white px-2 py-0.5 rounded-full group-hover:bg-fresh-green">
                  {t('common.step', 'Step')}
                </span>
              </div>
              <h3 className="text-base font-bold text-deep-charcoal mb-2 font-heading break-words">
                {t('landing.step2Title', '2. Plan Your Crop')}
              </h3>
              <p className="text-xs text-muted-green leading-relaxed max-w-xs">
                {t('landing.step2Desc', 'Receive top 3 seasonal crop recommendations for unplanted fields, or track growth stages for planted crops.')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-forest-green group-hover:text-white transition-all duration-300 mb-5 relative flex-shrink-0">
                3
                <span className="absolute -bottom-2 text-[10px] font-semibold bg-forest-green text-white px-2 py-0.5 rounded-full group-hover:bg-fresh-green">
                  {t('common.step', 'Step')}
                </span>
              </div>
              <h3 className="text-base font-bold text-deep-charcoal mb-2 font-heading break-words">
                {t('landing.step3Title', '3. Analyze Crop Health')}
              </h3>
              <p className="text-xs text-muted-green leading-relaxed max-w-xs">
                {t('landing.step3Desc', 'Upload a plant leaf image. Our AI model classifies the disease with true computer vision inference.')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-forest-green group-hover:text-white transition-all duration-300 mb-5 relative flex-shrink-0">
                4
                <span className="absolute -bottom-2 text-[10px] font-semibold bg-forest-green text-white px-2 py-0.5 rounded-full group-hover:bg-fresh-green">
                  {t('common.step', 'Step')}
                </span>
              </div>
              <h3 className="text-base font-bold text-deep-charcoal mb-2 font-heading break-words">
                {t('landing.step4Title', '4. Receive Guidance')}
              </h3>
              <p className="text-xs text-muted-green leading-relaxed max-w-xs">
                {t('landing.step4Desc', 'Receive personalized context-aware advisory synthesizing AI diagnosis with your field soil, water, and weather.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE FEATURE CARDS SECTION */}
      <section id="features" className="py-20 bg-soft-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="default" size="sm" className="mb-3">
              {t('landing.featuresTitle', 'Comprehensive Smart Farm Intelligence')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-forest-green">
              {t('landing.featuresTitle', 'Precision Intelligence for Modern Agriculture')}
            </h2>
            <p className="mt-3 text-base text-muted-green leading-relaxed">
              {t('landing.featuresSubtitle', 'Everything an Indian farmer needs to reduce crop risks and maximize farm profitability.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <Card hover className="p-8 border-border-green/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center mb-6 flex-shrink-0">
                  <Sprout className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-forest-green mb-3 break-words">
                  {t('landing.feat2Title', '1. Smart Crop Recommendations')}
                </h3>
                <p className="text-sm text-deep-charcoal/80 leading-relaxed mb-6">
                  {t('landing.feat2Desc', 'Agronomic recommendation engine analyzing soil pH, N-P-K nutrients, irrigation availability, and regional crop calendars.')}
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-muted-green border-t border-border-green pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropPlanning.recommendationsHeader', 'Top 3 realistic crop alternatives with agronomic match score')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropPlanning.practicalPrecautions', 'Growing duration, water demands, and risk precautions')}</span>
                </li>
              </ul>
            </Card>

            {/* Feature 2 */}
            <Card hover className="p-8 border-border-green/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center mb-6 flex-shrink-0">
                  <ScanEye className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-forest-green mb-3 break-words">
                  {t('landing.feat1Title', '2. DINOv2 Disease Classification')}
                </h3>
                <p className="text-sm text-deep-charcoal/80 leading-relaxed mb-6">
                  {t('landing.feat1Desc', 'State-of-the-art quantized DINOv2 vision model running locally on your device with out-of-distribution leaf detection across 38 PlantVillage categories.')}
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-muted-green border-t border-border-green pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropAnalysis.top3Sub', 'Real machine learning inference — no synthetic outputs')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropAnalysis.oodTitle', 'Reliable handling of uncertain images and non-plant uploads')}</span>
                </li>
              </ul>
            </Card>

            {/* Feature 3 (Standout) */}
            <Card hover className="p-8 border-2 border-fresh-green/40 bg-gradient-to-br from-white to-light-sage/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-fresh-green text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {t('common.active', 'Standout Feature')}
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-forest-green text-white flex items-center justify-center mb-6 shadow-md flex-shrink-0">
                  <BrainCircuit className="w-7 h-7 text-light-sage" />
                </div>
                <h3 className="text-xl font-bold font-heading text-forest-green mb-3 break-words">
                  3. {t('cropAnalysis.sec2Badge', 'Context-Aware Agricultural Advisory')}
                </h3>
                <p className="text-sm text-deep-charcoal/80 leading-relaxed mb-6">
                  {t('cropAnalysis.sec2Desc', 'FarmShield combines the detected leaf pathology with your field environmental records, irrigation delivery, fertilization timeline, and soil profile to highlight potential agronomic triggers.')}
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-muted-green border-t border-border-green pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropAnalysis.sec2Badge', 'Distinguishes potential contributing factors from confirmed causes')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('cropAnalysis.sec3Title', 'Safe field precautions & agronomic extension guidelines')}</span>
                </li>
              </ul>
            </Card>

            {/* Feature 4 */}
            <Card hover className="p-8 border-border-green/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center mb-6 flex-shrink-0">
                  <Trees className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-forest-green mb-3 break-words">
                  4. {t('landing.feat3Title', 'India Post DIGIPIN Mapping')}
                </h3>
                <p className="text-sm text-deep-charcoal/80 leading-relaxed mb-6">
                  {t('landing.feat3Desc', 'Precise 3.8m x 3.8m agricultural micro-plot boundaries utilizing the official 10-character National Digital Addressing grid.')}
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-muted-green border-t border-border-green pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('fields.subtitle', 'Full CRUD support for plots with auto growth-stage calculations')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>{t('history.subtitle', 'Historical diagnostic archive preserving previous reports')}</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* WHY FARMSHIELD & BENEFITS */}
      <section id="why-farmshield" className="py-20 bg-white border-t border-border-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <Badge variant="default" size="sm" className="mb-3">
                {t('nav.whyFarmShield', 'Why FarmShield?')}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-forest-green leading-tight">
                {t('landing.whyTitle', 'Traditional disease apps stop at a label. FarmShield provides actionable context.')}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-deep-charcoal/80 leading-relaxed">
                {t('landing.whyDesc', 'A computer vision classification alone cannot tell you why a fungal pathogen flourished in your specific field. FarmShield analyzes whether your flood irrigation created excess root moisture, whether recent high humidity triggered spore germination, or whether an unbalanced nitrogen application made leaf tissue susceptible.')}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-soft-cream border border-border-green">
                  <div className="w-7 h-7 rounded-lg bg-light-sage text-forest-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-deep-charcoal">{t('cropAnalysis.factorWater', 'Water & Irrigation Correlation')}</h4>
                    <p className="text-xs text-muted-green mt-0.5 leading-relaxed">
                      {t('cropPlanning.factorWater', 'Identifies when drip, sprinkler, or flood irrigation methods contribute to foliar disease transmission.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-soft-cream border border-border-green">
                  <div className="w-7 h-7 rounded-lg bg-light-sage text-forest-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-deep-charcoal">{t('cropAnalysis.factorFertilizer', 'Fertilizer Log Review')}</h4>
                    <p className="text-xs text-muted-green mt-0.5 leading-relaxed">
                      {t('cropPlanning.factorNutrients', 'Cross-checks recent urea or DAP applications to detect nitrogen imbalances that soften leaf cell walls.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-soft-cream border border-border-green">
                  <div className="w-7 h-7 rounded-lg bg-light-sage text-forest-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <SunMedium className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-deep-charcoal">{t('landing.feat4Title', 'Live Weather Integration')}</h4>
                    <p className="text-xs text-muted-green mt-0.5 leading-relaxed">
                      {t('landing.feat4Desc', 'Incorporates live temperature, humidity, and rainfall from Open-Meteo meteorological stations.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side visual highlight */}
            <div className="bg-forest-green text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-fresh-green/20 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-2xl font-bold font-heading mb-4 text-light-sage">
                {t('landing.benefitsTitle', 'Key Benefits for Agricultural Producers')}
              </h3>
              <p className="text-xs text-white/80 mb-6 leading-relaxed">
                {t('landing.benefitsSubtitle', 'Designed to minimize input waste, prevent harvest losses, and equip farmers with scientific agronomy.')}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">{t('landing.b1', 'Early pathogen detection before irreversible canopy collapse')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">{t('landing.b2', 'Personalized precautions tailored to your specific irrigation setup')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">{t('landing.b3', 'Estimated growth-stage tracking from sowing to harvest')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">{t('landing.b4', 'Permanent record keeping of all past field diagnoses')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">{t('landing.b5', 'Clear recommendations on when to consult university extension agronomists')}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-white/70">{t('landing.ctaSubtitle', 'Ready to optimize your farm?')}</p>
                  <p className="text-sm font-bold text-light-sage">{t('auth.registerTitle', 'Create your free farmer account')}</p>
                </div>
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="secondary" size="sm" icon={ArrowRight} className="w-full sm:w-auto">
                    {t('common.getStarted', 'Get Started')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT PLATFORM SECTION */}
      <section id="about" className="py-16 bg-soft-cream border-t border-border-green">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge variant="default" size="sm" className="mb-3">
            {t('nav.about', 'About FarmShield')}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-forest-green">
            {t('landing.heroBadge', 'AI-Powered Farmer Support and Decision Support Platform')}
          </h2>
          <p className="mt-4 text-sm text-deep-charcoal/80 leading-relaxed">
            {t('landing.footerText', 'FarmShield is engineered to democratize access to agronomic intelligence. Combining machine learning computer vision, transparent agronomic recommendation rules, and context-aware agricultural advisory, FarmShield bridges the gap between field data and actionable farm decisions.')}
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-forest-green text-white py-12 border-t border-forest-green/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-fresh-green flex items-center justify-center text-forest-green font-bold shadow-sm flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-forest-green" />
              </div>
              <span className="text-xl font-bold font-heading text-white">
                Farm<span className="text-light-sage">Shield</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
              <a href="#features" className="hover:text-white transition-colors">{t('nav.features', 'Features')}</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">{t('nav.howItWorks', 'How It Works')}</a>
              <a href="#why-farmshield" className="hover:text-white transition-colors">{t('nav.whyFarmShield', 'Why FarmShield')}</a>
              <a href="#about" className="hover:text-white transition-colors">{t('nav.about', 'About')}</a>
              <Link to="/login" className="hover:text-white transition-colors">{t('nav.login', 'Farmer Login')}</Link>
              <Link to="/register" className="hover:text-white transition-colors">{t('nav.register', 'Register')}</Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 text-center sm:text-left">
            <p>© {new Date().getFullYear()} FarmShield Agronomic Systems. {t('common.allRightsReserved', 'All rights reserved.')}</p>
            <p className="flex items-center justify-center gap-1">
              Engineered with <span className="text-fresh-green">React, Node.js & PyTorch/ONNX</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
