import React from 'react';
import { Link } from 'react-router-dom';
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
                <span className="w-2 h-2 rounded-full bg-fresh-green animate-pulse" />
                AI-Powered Farmer Decision Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-forest-green leading-[1.15] tracking-tight">
                Smarter Farming Starts with{' '}
                <span className="relative text-fresh-green inline-block">
                  Better Decisions.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-fresh-green/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,10 Q50,0 100,10" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-deep-charcoal/80 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Empowering farmers with AI-powered crop health analysis, smart crop
                recommendations, and personalized agricultural guidance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md" icon={ArrowRight}>
                    Get Started Free
                  </Button>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Features
                  </Button>
                </a>
              </div>

              {/* Trust Metric Micro-bar */}
              <div className="pt-6 border-t border-border-green/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 text-xs font-medium text-muted-green">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green" />
                  <span>PlantVillage AI Model</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green" />
                  <span>Context-Aware Diagnosis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green" />
                  <span>Zero Guesswork Guidance</span>
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
                        <span className="w-2.5 h-2.5 rounded-full bg-fresh-green animate-ping" />
                        <span className="text-xs font-bold text-forest-green uppercase tracking-wide">
                          Live Crop Diagnosis
                        </span>
                      </div>
                      <Badge variant="success" size="sm">94.2% Confidence</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-light-sage flex items-center justify-center text-forest-green font-bold text-lg">
                        🍃
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-deep-charcoal">Tomato Early Blight</p>
                        <p className="text-xs text-muted-green">Integrated with Soil & Rainfed Context</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Badge */}
                <div className="absolute -top-4 -right-4 bg-forest-green text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 border-2 border-white">
                  <BrainCircuit className="w-6 h-6 text-light-sage" />
                  <div className="text-left">
                    <p className="text-[10px] text-light-sage uppercase tracking-wider font-semibold">Standout Feature</p>
                    <p className="text-xs font-bold">Context-Aware Advisory</p>
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
            Transparent Workflow
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-forest-green">
            How FarmShield Works
          </h2>
          <p className="mt-3 text-base text-muted-green max-w-2xl mx-auto">
            From field registration to AI leaf classification and field-tailored guidance in four simple steps.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-forest-green group-hover:text-white transition-all duration-300 mb-5 relative">
                1
                <span className="absolute -bottom-2 text-[10px] font-semibold bg-forest-green text-white px-2 py-0.5 rounded-full group-hover:bg-fresh-green">
                  Step
                </span>
              </div>
              <h3 className="text-base font-bold text-deep-charcoal mb-2 font-heading">
                Register Your Field
              </h3>
              <p className="text-xs text-muted-green leading-relaxed max-w-xs">
                Log your plot name, location, soil type, irrigation method, and whether a crop is currently planted.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-forest-green group-hover:text-white transition-all duration-300 mb-5 relative">
                2
                <span className="absolute -bottom-2 text-[10px] font-semibold bg-forest-green text-white px-2 py-0.5 rounded-full group-hover:bg-fresh-green">
                  Step
                </span>
              </div>
              <h3 className="text-base font-bold text-deep-charcoal mb-2 font-heading">
                Plan Your Crop
              </h3>
              <p className="text-xs text-muted-green leading-relaxed max-w-xs">
                Receive top 3 seasonal crop recommendations for unplanted fields, or track growth stages for planted crops.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-forest-green group-hover:text-white transition-all duration-300 mb-5 relative">
                3
                <span className="absolute -bottom-2 text-[10px] font-semibold bg-forest-green text-white px-2 py-0.5 rounded-full group-hover:bg-fresh-green">
                  Step
                </span>
              </div>
              <h3 className="text-base font-bold text-deep-charcoal mb-2 font-heading">
                Analyze Crop Health
              </h3>
              <p className="text-xs text-muted-green leading-relaxed max-w-xs">
                Upload a plant leaf image. Our AI model classifies the disease with true computer vision inference.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-forest-green group-hover:text-white transition-all duration-300 mb-5 relative">
                4
                <span className="absolute -bottom-2 text-[10px] font-semibold bg-forest-green text-white px-2 py-0.5 rounded-full group-hover:bg-fresh-green">
                  Step
                </span>
              </div>
              <h3 className="text-base font-bold text-deep-charcoal mb-2 font-heading">
                Receive Guidance
              </h3>
              <p className="text-xs text-muted-green leading-relaxed max-w-xs">
                Receive personalized context-aware advisory synthesizing AI diagnosis with your field soil, water, and weather.
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
              Comprehensive Agronomic Toolkit
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-forest-green">
              Precision Intelligence for Modern Agriculture
            </h2>
            <p className="mt-3 text-base text-muted-green">
              Built specifically for farmers seeking scientific, transparent agricultural decisions without guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <Card hover className="p-8 border-border-green/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center mb-6">
                  <Sprout className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-forest-green mb-3">
                  1. Smart Crop Recommendations
                </h3>
                <p className="text-sm text-deep-charcoal/80 leading-relaxed mb-6">
                  Transparent rule-based recommendation engine for unplanted land. Computes suitability based on
                  regional soil types, irrigation infrastructure, seasonal calendars (Kharif, Rabi, Zaid), and previous crop rotation benefits.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-muted-green border-t border-border-green pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>Top 3 realistic crop alternatives with agronomic match score</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>Growing duration, water demands, and risk precautions</span>
                </li>
              </ul>
            </Card>

            {/* Feature 2 */}
            <Card hover className="p-8 border-border-green/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center mb-6">
                  <ScanEye className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-forest-green mb-3">
                  2. AI Crop Disease Detection
                </h3>
                <p className="text-sm text-deep-charcoal/80 leading-relaxed mb-6">
                  Computer vision inference powered by an ONNX MobileNet architecture trained on PlantVillage disease categories. Validates botanical foliage, checks leaf chlorophyll integrity, and outputs real confidence scores.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-muted-green border-t border-border-green pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>Real machine learning inference — no synthetic outputs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>Reliable handling of uncertain images and non-plant uploads</span>
                </li>
              </ul>
            </Card>

            {/* Feature 3 (Standout) */}
            <Card hover className="p-8 border-2 border-fresh-green/40 bg-gradient-to-br from-white to-light-sage/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-fresh-green text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Standout Feature
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-forest-green text-white flex items-center justify-center mb-6 shadow-md">
                  <BrainCircuit className="w-7 h-7 text-light-sage" />
                </div>
                <h3 className="text-xl font-bold font-heading text-forest-green mb-3">
                  3. Context-Aware Agricultural Advisory
                </h3>
                <p className="text-sm text-deep-charcoal/80 leading-relaxed mb-6">
                  FarmShield bridges the gap between vision AI and actual farm reality. It synthesizes the detected disease with field soil, irrigation type, fertilizer logs, crop growth stage, and live meteorological data into a structured 4-part advisory report.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-muted-green border-t border-border-green pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>Distinguishes potential contributing factors from confirmed causes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>Safe field precautions & agronomic extension guidelines</span>
                </li>
              </ul>
            </Card>

            {/* Feature 4 */}
            <Card hover className="p-8 border-border-green/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-light-sage text-forest-green flex items-center justify-center mb-6">
                  <Trees className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-forest-green mb-3">
                  4. Agricultural Field Management
                </h3>
                <p className="text-sm text-deep-charcoal/80 leading-relaxed mb-6">
                  A centralized dashboard to register multiple farm parcels, monitor cultivated acreage in Acres or Hectares, record fertilizer applications with dates, and track crop lifecycle timelines effortlessly.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-muted-green border-t border-border-green pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>Full CRUD support for plots with auto growth-stage calculations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-fresh-green flex-shrink-0" />
                  <span>Historical diagnostic archive preserving previous reports</span>
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
                Why FarmShield?
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-forest-green leading-tight">
                Traditional disease apps stop at a label. FarmShield provides actionable context.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-deep-charcoal/80 leading-relaxed">
                A computer vision classification alone cannot tell you why a fungal pathogen flourished in your specific field. FarmShield analyzes whether your flood irrigation created excess root moisture, whether recent high humidity triggered spore germination, or whether an unbalanced nitrogen application made leaf tissue susceptible.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-soft-cream border border-border-green">
                  <div className="w-7 h-7 rounded-lg bg-light-sage text-forest-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-deep-charcoal">Water & Irrigation Correlation</h4>
                    <p className="text-xs text-muted-green mt-0.5">
                      Identifies when drip, sprinkler, or flood irrigation methods contribute to foliar disease transmission.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-soft-cream border border-border-green">
                  <div className="w-7 h-7 rounded-lg bg-light-sage text-forest-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-deep-charcoal">Fertilizer Log Review</h4>
                    <p className="text-xs text-muted-green mt-0.5">
                      Cross-checks recent urea or DAP applications to detect nitrogen imbalances that soften leaf cell walls.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-soft-cream border border-border-green">
                  <div className="w-7 h-7 rounded-lg bg-light-sage text-forest-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <SunMedium className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-deep-charcoal">Live Weather Integration</h4>
                    <p className="text-xs text-muted-green mt-0.5">
                      Incorporates live temperature, humidity, and rainfall from Open-Meteo meteorological stations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side visual highlight */}
            <div className="bg-forest-green text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-fresh-green/20 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-2xl font-bold font-heading mb-4 text-light-sage">
                Key Benefits for Agricultural Producers
              </h3>
              <p className="text-xs text-white/80 mb-6 leading-relaxed">
                Designed to minimize input waste, prevent harvest losses, and equip farmers with scientific agronomy.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">Early pathogen detection before irreversible canopy collapse</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">Personalized precautions tailored to your specific irrigation setup</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">Estimated growth-stage tracking from sowing to harvest</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">Permanent record keeping of all past field diagnoses</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-fresh-green flex-shrink-0" />
                  <span className="text-sm">Clear recommendations on when to consult university extension agronomists</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Ready to optimize your farm?</p>
                  <p className="text-sm font-bold text-light-sage">Create your free farmer account</p>
                </div>
                <Link to="/register">
                  <Button variant="secondary" size="sm" icon={ArrowRight}>
                    Get Started
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
            About FarmShield
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-forest-green">
            AI-Powered Farmer Support and Decision Support Platform
          </h2>
          <p className="mt-4 text-sm text-deep-charcoal/80 leading-relaxed">
            FarmShield is engineered to democratize access to agronomic intelligence. Combining machine learning computer vision, transparent agronomic recommendation rules, and context-aware agricultural advisory, FarmShield bridges the gap between field data and actionable farm decisions.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-forest-green text-white py-12 border-t border-forest-green/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-fresh-green flex items-center justify-center text-forest-green font-bold shadow-sm">
                <ShieldCheck className="w-5 h-5 text-forest-green" />
              </div>
              <span className="text-xl font-bold font-heading text-white">
                Farm<span className="text-light-sage">Shield</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-white/80">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#why-farmshield" className="hover:text-white transition-colors">Why FarmShield</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <Link to="/login" className="hover:text-white transition-colors">Farmer Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
            <p>© {new Date().getFullYear()} FarmShield Agronomic Systems. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Engineered with <span className="text-fresh-green">React, Node.js & PyTorch/ONNX</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
