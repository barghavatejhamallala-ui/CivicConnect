import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import Card from '../../components/Card/Card';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import StatusTimeline from '../../components/StatusTimeline/StatusTimeline';
import WorkerProgress from '../../components/WorkerProgress/WorkerProgress';
import WorkPhotos from '../../components/WorkPhotos/WorkPhotos';
import CategoryIcon from '../../components/icons/CategoryIcon';
import ErrorState from '../../components/ErrorState/ErrorState';
import { Spinner } from '../../components/Loading/Loading';
import { categoryById, fetchComplaintById } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import './TrackStatus.css';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function TrackStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [complaint, setComplaint] = useState(undefined);

  useEffect(() => {
    setComplaint(undefined);
    fetchComplaintById(id).then((c) => setComplaint(c || null)).catch(() => setComplaint(null));
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(id);
    showToast('Complaint ID copied', 'info');
  };

  return (
    <AppLayout>
      <div className="container track">
        <div className="track__head">
          <button className="track__back" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={18} />
          </button>
          <h1>Track Status</h1>
        </div>

        {complaint === undefined && (
          <div className="track__loading"><Spinner size={30} /></div>
        )}

        {complaint === null && (
          <ErrorState
            title="Complaint not found"
            description="We couldn\u2019t find a complaint with that ID."
            actionLabel="Back to Complaints"
            onAction={() => navigate('/complaints')}
          />
        )}

        {complaint && (
          <div className="track__content anim-fade-up">
            <Card elevated className="track__summary">
              {complaint.photo && (
                <img src={complaint.photo} alt="Reported issue" className="track__photo" />
              )}
              <div className="track__summary-top">
                <span className="track__icon"><CategoryIcon id={complaint.category} size={22} /></span>
                <div className="track__summary-heading">
                  <span className="track__id">{complaint.id}</span>
                  <h2>{categoryById(complaint.category).label}</h2>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
              <p className="track__desc">{complaint.description}</p>
              <div className="track__meta">
                <span><MapPin size={14} /> {complaint.location}</span>
                <span><Calendar size={14} /> Submitted {formatDate(complaint.createdAt)}</span>
              </div>
              <button className="track__share" onClick={handleShare}>
                <Share2 size={14} /> Copy complaint ID
              </button>
            </Card>

            <Card className="track__timeline-card">
              <h3 className="track__timeline-title">Progress</h3>
              <StatusTimeline status={complaint.status} />
              {complaint.worker && (
                <>
                  <h3 className="track__timeline-title track__worker-title">Worker Progress</h3>
                  <WorkerProgress worker={complaint.worker} />
                </>
              )}
            </Card>

            {(complaint.worker || complaint.workPhotos) && (
              <Card className="track__photos-card">
                <WorkPhotos
                  photos={complaint.workPhotos}
                  status={complaint.status}
                  workerAssigned={!!complaint.worker}
                />
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
