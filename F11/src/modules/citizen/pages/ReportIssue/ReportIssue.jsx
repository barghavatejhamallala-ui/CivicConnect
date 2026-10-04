import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, MapPin, Crosshair, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import StepProgress from '../../components/StepProgress/StepProgress';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import CategoryIcon from '../../components/icons/CategoryIcon';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import SuccessState from '../../components/SuccessState/SuccessState';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { CATEGORIES, categoryById, createComplaint } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import './ReportIssue.css';

const STEPS = ['Category', 'Details', 'Location', 'Review'];

export default function ReportIssue() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileRef = useRef(null);

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const canGoNext = () => {
    if (step === 0) return !!category;
    if (step === 1) return description.trim().length >= 10;
    if (step === 2) return location.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) {
      if (step === 0) setErrors({ category: 'Choose a category to continue' });
      if (step === 1) setErrors({ description: 'Add at least 10 characters describing the issue' });
      if (step === 2) setErrors({ location: 'Add a location so we can dispatch the right team' });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    if (step === 0) return navigate(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const useCurrentLocation = () => {
    setLocating(true);
    setLocError('');
    if (!navigator.geolocation) {
      setLocating(false);
      setLocError('Location isn\u2019t available on this device. Please type it manually.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocation(`Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocError('Couldn\u2019t access your location. Please type it manually.');
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const complaint = await createComplaint({
        category,
        description,
        location,
        coords,
        photoFile: photo,
      });
      setSubmitted(complaint);
      showToast('Complaint submitted successfully', 'success');
    } catch (err) {
      showToast(err?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AppLayout>
        <div className="container report-success">
          <SuccessState
            title="Complaint Submitted"
            description={`Your report has been logged as ${submitted.id}. We\u2019ll notify you as it progresses.`}
          >
            <Card className="report-success__id-card">
              <span>Complaint ID</span>
              <strong>{submitted.id}</strong>
              <StatusBadge status="submitted" size="sm" />
            </Card>
            <Button size="lg" fullWidth onClick={() => navigate(`/track/${submitted.id}`)}>
              Track This Complaint
            </Button>
            <Button size="lg" fullWidth variant="ghost" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </SuccessState>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container report">
        <div className="report__head">
          <button className="report__back" onClick={handleBack} aria-label="Go back">
            <ArrowLeft size={18} />
          </button>
          <h1>Report an Issue</h1>
        </div>

        <StepProgress steps={STEPS} current={step} />

        <Card className="report__card" elevated>
                      {step === 0 && (
              <div key="cat" className="report__step anim-fade-up">
                <h2 className="report__step-title">Choose a category</h2>
                <p className="report__step-hint">What kind of issue are you reporting?</p>
                <div className="report__categories">
                  {CATEGORIES.map((c, i) => (
                    <CategoryCard
                      key={c.id}
                      category={c}
                      selected={category === c.id}
                      onSelect={(id) => { setCategory(id); setErrors({}); }}
                      index={i}
                    />
                  ))}
                </div>
                {errors.category && <p className="report__error">{errors.category}</p>}
              </div>
            )}

            {step === 1 && (
              <div key="details" className="report__step anim-fade-up">
                <h2 className="report__step-title">Add details</h2>
                <p className="report__step-hint">A photo and clear description help us resolve it faster.</p>

                <div className="report__photo">
                  {photoPreview ? (
                    <div className="report__photo-preview">
                      <img src={photoPreview} alt="Uploaded issue" />
                      <button type="button" className="report__photo-remove" onClick={removePhoto} aria-label="Remove photo">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="report__photo-upload" onClick={() => fileRef.current?.click()}>
                      <Camera size={26} />
                      <span>Upload a photo</span>
                      <span className="report__photo-hint">Optional, but helpful</span>
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={handlePhoto} />
                </div>

                <Input
                  label="Description"
                  textarea
                  rows={5}
                  placeholder="Describe what you saw — the more detail, the better."
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setErrors({}); }}
                  error={errors.description}
                  helper={`${description.length} characters`}
                />
              </div>
            )}

            {step === 2 && (
              <div key="location" className="report__step anim-fade-up">
                <h2 className="report__step-title">Location</h2>
                <p className="report__step-hint">Tell us where this issue is so we can dispatch the right team.</p>

                <button type="button" className="report__locate-btn" onClick={useCurrentLocation} disabled={locating}>
                  <Crosshair size={17} className={locating ? 'report__locate-spin' : ''} />
                  {locating ? 'Locating…' : 'Use current location'}
                </button>
                {locError && <p className="report__error">{locError}</p>}

                <Input
                  label="Location"
                  icon={MapPin}
                  placeholder="Street, landmark, or area"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setCoords(null); setErrors({}); }}
                  error={errors.location}
                />

                <div className="report__map-preview">
                  <div className="report__map-grid" />
                  <span className="report__map-pin"><MapPin size={22} /></span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div key="review" className="report__step anim-fade-up">
                <h2 className="report__step-title">Review & submit</h2>
                <p className="report__step-hint">Confirm the details before you submit your report.</p>

                <div className="report__review">
                  {photoPreview && (
                    <img src={photoPreview} alt="Issue" className="report__review-photo" />
                  )}
                  <div className="report__review-row">
                    <span className="report__review-icon"><CategoryIcon id={category} size={18} /></span>
                    <div>
                      <strong>{categoryById(category).label}</strong>
                      <p>{description}</p>
                    </div>
                  </div>
                  <div className="report__review-row">
                    <span className="report__review-icon"><MapPin size={18} /></span>
                    <div><strong>Location</strong><p>{location}</p></div>
                  </div>
                </div>
              </div>
            )}
        </Card>

        <div className="report__actions">
          {step < STEPS.length - 1 ? (
            <Button size="lg" fullWidth icon={ArrowRight} iconPosition="right" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button size="lg" fullWidth icon={Check} iconPosition="right" loading={submitting} onClick={handleSubmit}>
              Submit Complaint
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
