import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trees,
  Plus,
  Edit2,
  Trash2,
  Sprout,
  Droplets,
  Layers,
  MapPin,
  Calendar,
  Search,
  ScanEye,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

const MyFieldsPage = ({ onOpenAddField, onEditField }) => {
  const { t } = useTranslation();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSoil, setFilterSoil] = useState('ALL');
  const [filterPlanted, setFilterPlanted] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fields');
      if (res.data?.success) {
        setFields(res.data.fields || []);
      }
    } catch (err) {
      console.error('Failed to load fields:', err);
      setMessage({ type: 'error', text: 'Failed to load your agricultural fields.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/fields/${deleteTarget._id}`);
      setFields((prev) => prev.filter((f) => f._id !== deleteTarget._id));
      setMessage({ type: 'success', text: `Field "${deleteTarget.fieldName}" removed successfully.` });
      setDeleteTarget(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete field. Please try again.' });
    } finally {
      setDeleting(false);
    }
  };

  // Filter fields
  const filteredFields = fields.filter((f) => {
    const matchesSearch =
      f.fieldName.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase()) ||
      f.village.toLowerCase().includes(search.toLowerCase()) ||
      (f.cropName && f.cropName.toLowerCase().includes(search.toLowerCase()));

    const matchesSoil = filterSoil === 'ALL' || f.soilType === filterSoil;
    const matchesPlanted =
      filterPlanted === 'ALL' ||
      (filterPlanted === 'PLANTED' && f.isCropPlanted) ||
      (filterPlanted === 'UNPLANTED' && !f.isCropPlanted);

    return matchesSearch && matchesSoil && matchesPlanted;
  });

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-forest-green flex items-center gap-2">
            <Trees className="w-6 h-6 text-fresh-green flex-shrink-0" />
            <span>{t('fields.title')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-green mt-0.5">
            {t('fields.subtitle')}
          </p>
        </div>

        <Button onClick={onOpenAddField} variant="primary" size="md" icon={Plus} className="flex-shrink-0">
          {t('fields.addNewFieldBtn')}
        </Button>
      </div>

      {message && (
        <Alert
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-muted-green absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t('fields.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green bg-soft-cream/20"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterSoil}
              onChange={(e) => setFilterSoil(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-green focus:border-forest-green bg-white"
            >
              <option value="ALL">{t('fields.allSoilTypes')}</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
              <option value="Black Soil">Black Soil</option>
              <option value="Red Soil">Red Soil</option>
              <option value="Laterite Soil">Laterite Soil</option>
              <option value="Sandy Soil">Sandy Soil</option>
              <option value="Clay Soil">Clay Soil</option>
              <option value="Loamy Soil">Loamy Soil</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={filterPlanted}
              onChange={(e) => setFilterPlanted(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-green focus:border-forest-green bg-white"
            >
              <option value="ALL">{t('common.all')}</option>
              <option value="PLANTED">Planted Crops Only</option>
              <option value="UNPLANTED">Unplanted / Available Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Fields Grid */}
      {filteredFields.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center bg-soft-cream/40 border-dashed">
          <Trees className="w-12 h-12 text-muted-green mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-deep-charcoal font-heading">
            {fields.length === 0 ? t('fields.emptyStateTitle') : t('fields.noFieldsFound')}
          </h3>
          <p className="text-xs text-muted-green mt-1 max-w-md mx-auto mb-5 leading-relaxed">
            {fields.length === 0 ? t('fields.emptyStateDesc') : t('fields.noFieldsFound')}
          </p>
          {fields.length === 0 ? (
            <Button onClick={onOpenAddField} variant="primary" icon={Plus}>
              {t('fields.addNewFieldBtn')}
            </Button>
          ) : (
            <Button
              onClick={() => {
                setSearch('');
                setFilterSoil('ALL');
                setFilterPlanted('ALL');
              }}
              variant="outline"
              size="sm"
            >
              {t('common.refresh')}
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredFields.map((field) => (
            <Card
              key={field._id}
              hover
              className="p-5 sm:p-6 flex flex-col justify-between border-t-4 border-t-forest-green h-full"
            >
              <div>
                {/* Header with Title and Badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-deep-charcoal font-heading break-words">
                    {field.fieldName}
                  </h3>
                  <Badge
                    variant={field.isCropPlanted ? 'success' : 'neutral'}
                    size="sm"
                    dot
                  >
                    {field.isCropPlanted ? 'Planted' : 'Unplanted'}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-green mb-3">
                  <MapPin className="w-3.5 h-3.5 text-fresh-green flex-shrink-0" />
                  <span className="truncate">
                    {field.village}, {field.district} {field.state ? `(${field.state})` : ''}
                  </span>
                </div>

                {/* DIGIPIN & Geospatial Coordinates Badge */}
                {field.digipin && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-light-sage/30 border border-light-sage text-xs mb-3 flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[9px] uppercase font-extrabold text-forest-green bg-white px-1.5 py-0.5 rounded shadow-xs flex-shrink-0">
                        DIGIPIN
                      </span>
                      <span className="font-mono font-extrabold text-forest-green text-xs truncate">
                        {field.digipin}
                      </span>
                    </div>
                    {field.latitude && field.longitude && (
                      <span className="text-[10px] text-muted-green font-mono flex-shrink-0">
                        {Number(field.latitude).toFixed(3)}°, {Number(field.longitude).toFixed(3)}°
                      </span>
                    )}
                  </div>
                )}

                {/* Field Metrics Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-soft-cream/60 border border-border-green/80 mb-4">
                  <div>
                    <span className="text-muted-green block text-[10px] uppercase font-semibold">{t('fields.cardAcreage')}</span>
                    <span className="font-bold text-deep-charcoal">
                      {field.area} {field.areaUnit}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-green block text-[10px] uppercase font-semibold">{t('fields.cardSoil')}</span>
                    <span className="font-semibold text-deep-charcoal truncate block">
                      {field.soilType} {field.soilPh !== null && field.soilPh !== undefined ? `(pH ${field.soilPh})` : ''}
                    </span>
                  </div>
                  <div className="mt-1 pt-1 border-t border-border-green/60">
                    <span className="text-muted-green block text-[10px] uppercase font-semibold">{t('fields.cardWater')}</span>
                    <span className="font-semibold text-deep-charcoal truncate block">
                      {field.waterAvailability ? `${field.waterAvailability} • ${field.waterSource || field.irrigationMethod}` : field.irrigationMethod}
                    </span>
                  </div>
                  <div className="mt-1 pt-1 border-t border-border-green/60">
                    <span className="text-muted-green block text-[10px] uppercase font-semibold">Prev. Crop</span>
                    <span className="font-semibold text-deep-charcoal truncate block">
                      {field.previousCrop || t('common.notAvailable')}
                    </span>
                  </div>
                </div>

                {/* Crop Status Section */}
                {field.isCropPlanted ? (
                  <div className="p-3 rounded-xl bg-light-sage/30 border border-light-sage space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-forest-green flex items-center gap-1.5 truncate">
                        <Sprout className="w-4 h-4 text-forest-green flex-shrink-0" />
                        <span className="truncate">{field.cropName} {field.cropVariety ? `(${field.cropVariety})` : ''}</span>
                      </span>
                      {field.plantingDate && (
                        <span className="text-[10px] text-muted-green flex-shrink-0 ml-1">
                          {t('fields.cardSownDate')}: {new Date(field.plantingDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Fertilizer Records count */}
                    <div className="text-[11px] text-deep-charcoal/80 flex items-center justify-between">
                      <span className="text-muted-green">Fertilizers:</span>
                      <span className="font-semibold">
                        {field.fertilizers?.length || 0} logged
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-soft-cream/50 border border-dashed border-border-green text-center text-xs text-muted-green mb-4">
                    <p className="font-medium text-deep-charcoal">Field is currently fallow</p>
                    <Link
                      to={`/crops?fieldId=${field._id}`}
                      className="text-forest-green font-semibold hover:underline inline-flex items-center gap-1 mt-1 text-[11px]"
                    >
                      <Sparkles className="w-3 h-3 text-fresh-green" /> <span>{t('fields.btnPlan')}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border-green/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditField(field)}
                    className="p-2 rounded-lg text-deep-charcoal hover:bg-light-sage/50 transition-colors"
                    title={t('fields.btnEdit')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(field)}
                    className="p-2 rounded-lg text-error-red hover:bg-[#FDF0EE] transition-colors"
                    title={t('fields.btnDelete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/analysis?fieldId=${field._id}`}>
                    <Button variant="sage" size="sm" icon={ScanEye}>
                      {t('fields.btnAnalyze')}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('fields.confirmDeleteTitle')}
        subtitle={t('fields.confirmDeleteMsg')}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-deep-charcoal leading-relaxed">
            {t('fields.confirmDeleteMsg')}
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-green">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={handleDelete}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyFieldsPage;
