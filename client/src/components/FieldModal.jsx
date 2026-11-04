import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Layers,
  Sprout,
  Plus,
  Trash2,
  Calendar,
  Compass,
  Droplets,
  FlaskConical,
  Activity,
  FileText,
  Info,
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import LocationPicker from './LocationPicker';

const SOIL_TYPES = [
  'Alluvial Soil',
  'Black Soil',
  'Red Soil',
  'Laterite Soil',
  'Sandy Soil',
  'Clay Soil',
  'Loamy Soil',
  'Other',
];

const SOIL_DRAINAGE_OPTIONS = [
  'Well-drained',
  'Moderate',
  'Poor / Waterlogged',
  'Excessive',
];

const IRRIGATION_METHODS = [
  'Drip Irrigation',
  'Sprinkler Irrigation',
  'Flood Irrigation',
  'Rainfed',
  'Other',
];

const WATER_SOURCE_OPTIONS = [
  'Borewell',
  'Canal',
  'River / Stream',
  'Farm Pond / Tank',
  'Rainwater / Rainfed',
  'Reservoir',
  'Other',
];

const WATER_AVAILABILITY_OPTIONS = [
  'High',
  'Moderate',
  'Low',
];

const SEASONAL_AVAILABILITY_OPTIONS = [
  'Year-round',
  'Monsoon only',
  'Winter & Summer limited',
  'Seasonal / Critical periods',
];

const FieldModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const [formData, setFormData] = useState({
    fieldName: '',
    location: '',
    district: '',
    village: '',
    state: '',
    pincode: '',
    digipin: '',
    latitude: null,
    longitude: null,
    locationSource: 'manual',
    area: '',
    areaUnit: 'Acres',
    // Soil
    soilType: 'Alluvial Soil',
    soilDrainage: 'Well-drained',
    soilPh: '',
    soilNitrogen: '',
    soilPhosphorus: '',
    soilPotassium: '',
    organicCarbon: '',
    electricalConductivity: '',
    zinc: '',
    iron: '',
    boron: '',
    soilTestDate: '',
    soilTestNotes: '',
    // Water
    waterSource: 'Borewell',
    waterAvailability: 'Moderate',
    seasonalAvailability: 'Year-round',
    irrigationMethod: 'Drip Irrigation',
    irrigationFrequency: '',
    estimatedWaterQuantity: '',
    // Crop & history
    previousCrop: '',
    isCropPlanted: false,
    cropName: '',
    cropVariety: '',
    plantingDate: '',
    fertilizers: [],
  });

  const [fertilizerInput, setFertilizerInput] = useState({
    fertilizerName: '',
    applicationDate: new Date().toISOString().split('T')[0],
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        fieldName: editData.fieldName || '',
        location: editData.location || '',
        district: editData.district || '',
        village: editData.village || '',
        state: editData.state || '',
        pincode: editData.pincode || '',
        digipin: editData.digipin || '',
        latitude: editData.latitude !== undefined ? editData.latitude : null,
        longitude: editData.longitude !== undefined ? editData.longitude : null,
        locationSource: editData.locationSource || 'manual',
        area: editData.area || '',
        areaUnit: editData.areaUnit || 'Acres',
        soilType: editData.soilType || 'Alluvial Soil',
        soilDrainage: editData.soilDrainage || 'Well-drained',
        soilPh: editData.soilPh !== null && editData.soilPh !== undefined ? editData.soilPh : '',
        soilNitrogen: editData.soilNitrogen !== null && editData.soilNitrogen !== undefined ? editData.soilNitrogen : '',
        soilPhosphorus: editData.soilPhosphorus !== null && editData.soilPhosphorus !== undefined ? editData.soilPhosphorus : '',
        soilPotassium: editData.soilPotassium !== null && editData.soilPotassium !== undefined ? editData.soilPotassium : '',
        organicCarbon: editData.organicCarbon !== null && editData.organicCarbon !== undefined ? editData.organicCarbon : '',
        electricalConductivity: editData.electricalConductivity !== null && editData.electricalConductivity !== undefined ? editData.electricalConductivity : '',
        zinc: editData.zinc !== null && editData.zinc !== undefined ? editData.zinc : '',
        iron: editData.iron !== null && editData.iron !== undefined ? editData.iron : '',
        boron: editData.boron !== null && editData.boron !== undefined ? editData.boron : '',
        soilTestDate: editData.soilTestDate ? new Date(editData.soilTestDate).toISOString().split('T')[0] : '',
        soilTestNotes: editData.soilTestNotes || '',
        waterSource: editData.waterSource || 'Borewell',
        waterAvailability: editData.waterAvailability || 'Moderate',
        seasonalAvailability: editData.seasonalAvailability || 'Year-round',
        irrigationMethod: editData.irrigationMethod || 'Drip Irrigation',
        irrigationFrequency: editData.irrigationFrequency || '',
        estimatedWaterQuantity: editData.estimatedWaterQuantity || '',
        previousCrop: editData.previousCrop || '',
        isCropPlanted: Boolean(editData.isCropPlanted),
        cropName: editData.cropName || '',
        cropVariety: editData.cropVariety || '',
        plantingDate: editData.plantingDate
          ? new Date(editData.plantingDate).toISOString().split('T')[0]
          : '',
        fertilizers: editData.fertilizers || [],
      });
    } else {
      setFormData({
        fieldName: '',
        location: '',
        district: '',
        village: '',
        state: '',
        pincode: '',
        digipin: '',
        latitude: null,
        longitude: null,
        locationSource: 'manual',
        area: '',
        areaUnit: 'Acres',
        soilType: 'Alluvial Soil',
        soilDrainage: 'Well-drained',
        soilPh: '',
        soilNitrogen: '',
        soilPhosphorus: '',
        soilPotassium: '',
        organicCarbon: '',
        electricalConductivity: '',
        zinc: '',
        iron: '',
        boron: '',
        soilTestDate: '',
        soilTestNotes: '',
        waterSource: 'Borewell',
        waterAvailability: 'Moderate',
        seasonalAvailability: 'Year-round',
        irrigationMethod: 'Drip Irrigation',
        irrigationFrequency: '',
        estimatedWaterQuantity: '',
        previousCrop: '',
        isCropPlanted: false,
        cropName: '',
        cropVariety: '',
        plantingDate: '',
        fertilizers: [],
      });
    }
    setError('');
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLocationSelect = (loc) => {
    setFormData((prev) => ({
      ...prev,
      digipin: loc.digipin || prev.digipin,
      latitude: loc.latitude !== null && loc.latitude !== undefined ? loc.latitude : prev.latitude,
      longitude: loc.longitude !== null && loc.longitude !== undefined ? loc.longitude : prev.longitude,
      village: loc.village || prev.village,
      district: loc.district || prev.district,
      state: loc.state || prev.state,
      pincode: loc.pincode || prev.pincode,
      location: loc.displayName || prev.location || (loc.village ? `${loc.village}, ${loc.district}` : prev.location),
      locationSource: loc.locationSource || prev.locationSource,
    }));
  };

  const handleAddFertilizer = () => {
    if (!fertilizerInput.fertilizerName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      fertilizers: [
        ...prev.fertilizers,
        {
          fertilizerName: fertilizerInput.fertilizerName.trim(),
          applicationDate: fertilizerInput.applicationDate,
        },
      ],
    }));
    setFertilizerInput({
      fertilizerName: '',
      applicationDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleRemoveFertilizer = (index) => {
    setFormData((prev) => ({
      ...prev,
      fertilizers: prev.fertilizers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fieldName.trim()) {
      setError('Field name is required.');
      return;
    }
    if (!formData.location.trim() || !formData.district.trim() || !formData.village.trim()) {
      setError('Location, District, and Village are required.');
      return;
    }
    if (!formData.area || Number(formData.area) <= 0) {
      setError('Please provide a valid field area greater than 0.');
      return;
    }
    if (formData.isCropPlanted && !formData.cropName.trim()) {
      setError('Crop name is required when a crop is planted in this field.');
      return;
    }

    try {
      setSubmitting(true);
      await onSave(formData, editData?._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save field details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? 'Edit Agricultural Field' : 'Register New Agricultural Field'}
      subtitle="Complete agronomic profile: DIGIPIN, GPS mapping, soil health, water availability & crop history"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* ============================================================== */}
        {/* SECTION 1: BASIC FIELD INFORMATION */}
        {/* ============================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-green">
            <h4 className="text-sm font-bold text-forest-green uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-forest-green text-white text-[11px] flex items-center justify-center font-bold">1</span>
              Basic Field Information & Area
            </h4>
            <span className="text-[11px] text-muted-green font-medium">Core Identifiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Field / Plot Name *
              </label>
              <input
                type="text"
                name="fieldName"
                value={formData.fieldName}
                onChange={handleChange}
                placeholder="e.g. North Cauvery Basin Plot, Sector 4"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/30 font-semibold"
                required
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                  Field Area *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. 4.5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/30"
                  required
                />
              </div>
              <div className="w-28">
                <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                  Unit *
                </label>
                <select
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-white"
                >
                  <option value="Acres">Acres</option>
                  <option value="Hectares">Hectares</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: LOCATION & DIGIPIN */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2 border-t border-border-green">
          <div className="flex items-center justify-between pb-2 border-b border-border-green">
            <h4 className="text-sm font-bold text-forest-green uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-forest-green text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <MapPin className="w-4 h-4 text-fresh-green" /> Geospatial Location & DIGIPIN
            </h4>
            <span className="text-[11px] text-muted-green font-medium">
              National Digital Grid (India Post) & Leaflet GPS
            </span>
          </div>

          <LocationPicker
            initialLocation={{
              digipin: formData.digipin,
              latitude: formData.latitude,
              longitude: formData.longitude,
              village: formData.village,
              district: formData.district,
              state: formData.state,
              pincode: formData.pincode,
              displayName: formData.location,
              locationSource: formData.locationSource,
            }}
            onLocationSelect={handleLocationSelect}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Village / Locality *
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="e.g. Pappampatti, Sulur"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-soft-cream/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                District *
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Coimbatore, Thanjavur, Salem"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-soft-cream/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Tamil Nadu, Andhra Pradesh"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-soft-cream/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Address Landmark / Road Access *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Near Canal Sluice 3, Trichy Highway Road"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-soft-cream/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Postal PIN Code
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g. 641402"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-soft-cream/20"
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: SOIL PROFILE & TEXTURE */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2 border-t border-border-green">
          <div className="flex items-center justify-between pb-2 border-b border-border-green">
            <h4 className="text-sm font-bold text-forest-green uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-forest-green text-white text-[11px] flex items-center justify-center font-bold">3</span>
              <Layers className="w-4 h-4 text-fresh-green" /> Soil Profile & Drainage
            </h4>
            <span className="text-[11px] text-muted-green font-medium">Physical Characteristics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Soil Type *
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-white"
              >
                {SOIL_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-muted-green mt-1">
                Major geological texture determining water percolation and tillage.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Soil Drainage Quality
              </label>
              <select
                name="soilDrainage"
                value={formData.soilDrainage}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-white"
              >
                {SOIL_DRAINAGE_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-muted-green mt-1">
                Affects root oxygenation and vulnerability to fungal root rot.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 4: SOIL HEALTH & NUTRIENT TEST (OPTIONAL) */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2 border-t border-border-green">
          <div className="flex items-center justify-between pb-2 border-b border-border-green">
            <h4 className="text-sm font-bold text-forest-green uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-forest-green text-white text-[11px] flex items-center justify-center font-bold">4</span>
              <FlaskConical className="w-4 h-4 text-fresh-green" /> Soil Health Card & Nutrients (Optional)
            </h4>
            <span className="text-[11px] text-forest-green bg-light-sage/60 px-2 py-0.5 rounded-full font-bold">
              Recommended for Precision Guidance
            </span>
          </div>

          <div className="p-3 rounded-xl bg-soft-cream/60 border border-border-green text-xs text-muted-green flex items-start gap-2">
            <Info className="w-4 h-4 text-forest-green flex-shrink-0 mt-0.5" />
            <span>
              If you have a <strong>Government Soil Health Card (SHC)</strong> or laboratory test report, enter your measured values below.
              Leaving fields blank is fully supported — FarmShield will treat them as unmeasured rather than assuming false ideal conditions.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-deep-charcoal mb-1">
                Soil pH (3.5 - 10.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="3.5"
                max="10.0"
                name="soilPh"
                value={formData.soilPh}
                onChange={handleChange}
                placeholder="e.g. 6.8"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              />
              <span className="text-[9px] text-muted-green">Neutral: 6.5 - 7.5</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-deep-charcoal mb-1">
                Available N (kg/ha)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                name="soilNitrogen"
                value={formData.soilNitrogen}
                onChange={handleChange}
                placeholder="e.g. 280"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              />
              <span className="text-[9px] text-muted-green">Medium: 280-560 kg/ha</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-deep-charcoal mb-1">
                Available P (kg/ha)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                name="soilPhosphorus"
                value={formData.soilPhosphorus}
                onChange={handleChange}
                placeholder="e.g. 18.5"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              />
              <span className="text-[9px] text-muted-green">Medium: 11-25 kg/ha</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-deep-charcoal mb-1">
                Available K (kg/ha)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                name="soilPotassium"
                value={formData.soilPotassium}
                onChange={handleChange}
                placeholder="e.g. 195"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              />
              <span className="text-[9px] text-muted-green">Medium: 110-280 kg/ha</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-deep-charcoal mb-1">
                Organic Carbon (OC %)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                name="organicCarbon"
                value={formData.organicCarbon}
                onChange={handleChange}
                placeholder="e.g. 0.65"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              />
              <span className="text-[9px] text-muted-green">Ideal: &gt; 0.75 %</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-deep-charcoal mb-1">
                Electrical Cond. (EC dS/m)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="electricalConductivity"
                value={formData.electricalConductivity}
                onChange={handleChange}
                placeholder="e.g. 0.45"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              />
              <span className="text-[9px] text-muted-green">Non-saline: &lt; 1.0</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-deep-charcoal mb-1">
                Available Zinc (Zn ppm)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="zinc"
                value={formData.zinc}
                onChange={handleChange}
                placeholder="e.g. 0.85"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              />
              <span className="text-[9px] text-muted-green">Critical: 0.6 ppm</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-deep-charcoal mb-1">
                Soil Test Date
              </label>
              <input
                type="date"
                name="soilTestDate"
                value={formData.soilTestDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              />
              <span className="text-[9px] text-muted-green">Date of sampling</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 5: WATER AVAILABILITY & INFRASTRUCTURE */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2 border-t border-border-green">
          <div className="flex items-center justify-between pb-2 border-b border-border-green">
            <h4 className="text-sm font-bold text-forest-green uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-forest-green text-white text-[11px] flex items-center justify-center font-bold">5</span>
              <Droplets className="w-4 h-4 text-fresh-green" /> Irrigation & Water Availability
            </h4>
            <span className="text-[11px] text-muted-green font-medium">Hydrological Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Primary Water Source *
              </label>
              <select
                name="waterSource"
                value={formData.waterSource}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              >
                {WATER_SOURCE_OPTIONS.map((ws) => (
                  <option key={ws} value={ws}>
                    {ws}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Water Availability Level *
              </label>
              <select
                name="waterAvailability"
                value={formData.waterAvailability}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white font-semibold"
              >
                {WATER_AVAILABILITY_OPTIONS.map((wa) => (
                  <option key={wa} value={wa}>
                    {wa} Availability
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Seasonal Reliability
              </label>
              <select
                name="seasonalAvailability"
                value={formData.seasonalAvailability}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              >
                {SEASONAL_AVAILABILITY_OPTIONS.map((sa) => (
                  <option key={sa} value={sa}>
                    {sa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Irrigation Delivery Method *
              </label>
              <select
                name="irrigationMethod"
                value={formData.irrigationMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-white"
              >
                {IRRIGATION_METHODS.map((im) => (
                  <option key={im} value={im}>
                    {im}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Irrigation Frequency (Optional)
              </label>
              <input
                type="text"
                name="irrigationFrequency"
                value={formData.irrigationFrequency}
                onChange={handleChange}
                placeholder="e.g. Every 3 days, Weekly"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-soft-cream/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                Available Water Quantity / Capacity
              </label>
              <input
                type="text"
                name="estimatedWaterQuantity"
                value={formData.estimatedWaterQuantity}
                onChange={handleChange}
                placeholder="e.g. 4 hours power/day, 2-inch pipe"
                className="w-full px-3 py-2 rounded-xl border border-border-green focus:border-forest-green text-xs bg-soft-cream/20"
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 6: CROP STATUS & ROTATION HISTORY */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-2 border-t border-border-green">
          <div className="flex items-center justify-between pb-2 border-b border-border-green">
            <h4 className="text-sm font-bold text-forest-green uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-forest-green text-white text-[11px] flex items-center justify-center font-bold">6</span>
              <Sprout className="w-4 h-4 text-fresh-green" /> Crop Status & Rotation History
            </h4>
            <span className="text-[11px] text-muted-green font-medium">Agronomic Cycle</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-deep-charcoal mb-1">
              Previous Crop Harvested from this Plot
            </label>
            <input
              type="text"
              name="previousCrop"
              value={formData.previousCrop}
              onChange={handleChange}
              placeholder="e.g. Black Gram, Rice, Soybean, Groundnut"
              className="w-full px-3.5 py-2 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/30"
            />
            <p className="text-[10px] text-muted-green mt-1">
              Used to evaluate nitrogen fixation benefits and break pest/nematode carryover cycles.
            </p>
          </div>

          {/* Planted Toggle */}
          <div className="bg-light-sage/30 rounded-2xl p-4 border border-light-sage flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sprout className="w-6 h-6 text-forest-green" />
              <div>
                <p className="text-sm font-bold text-forest-green">
                  Is a crop currently planted in this field?
                </p>
                <p className="text-xs text-muted-green">
                  {formData.isCropPlanted
                    ? 'Yes: Track growth stages, days since planting & fertilizer applications'
                    : 'No: Field will receive multi-factor crop recommendations'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isCropPlanted"
                  checked={formData.isCropPlanted}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border-green peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-green after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-green"></div>
              </label>
            </div>
          </div>

          {/* Planted Crop Details */}
          {formData.isCropPlanted && (
            <div className="p-4 rounded-2xl bg-white border border-border-green space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleChange}
                    placeholder="e.g. Rice, Tomato, Cotton"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm"
                    required={formData.isCropPlanted}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                    Variety (Optional)
                  </label>
                  <input
                    type="text"
                    name="cropVariety"
                    value={formData.cropVariety}
                    onChange={handleChange}
                    placeholder="e.g. CO 51, ADT 45, PKM 1"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                    Planting / Sowing Date *
                  </label>
                  <input
                    type="date"
                    name="plantingDate"
                    value={formData.plantingDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm"
                    required={formData.isCropPlanted}
                  />
                </div>
              </div>

              {/* Fertilizer Log */}
              <div className="pt-2 border-t border-border-green space-y-3">
                <h5 className="text-xs font-bold text-forest-green uppercase tracking-wider">
                  Fertilizer Application History
                </h5>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Fertilizer Name (e.g. Urea 46% N, DAP 18:46:0)"
                    value={fertilizerInput.fertilizerName}
                    onChange={(e) =>
                      setFertilizerInput({ ...fertilizerInput, fertilizerName: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-border-green text-xs"
                  />
                  <input
                    type="date"
                    value={fertilizerInput.applicationDate}
                    onChange={(e) =>
                      setFertilizerInput({ ...fertilizerInput, applicationDate: e.target.value })
                    }
                    className="px-3 py-2 rounded-xl border border-border-green text-xs"
                  />
                  <Button
                    type="button"
                    onClick={handleAddFertilizer}
                    variant="outline"
                    size="sm"
                    icon={Plus}
                  >
                    Add Log
                  </Button>
                </div>

                {formData.fertilizers.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {formData.fertilizers.map((fert, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-soft-cream/40 border border-border-green text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-deep-charcoal">{fert.fertilizerName}</span>
                          <span className="text-muted-green">
                            ({new Date(fert.applicationDate).toLocaleDateString()})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFertilizer(idx)}
                          className="text-error-red hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-green">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            {editData ? 'Save Changes' : 'Register Agricultural Field'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FieldModal;
