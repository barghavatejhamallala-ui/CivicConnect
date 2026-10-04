import './RecentActivity.css';
import { CircleCheck, UserCheck, Wrench, Send, Bell } from 'lucide-react';

const ICONS = [
  { match: /submitted/i, icon: Send, tone: 'info' },
  { match: /review/i, icon: Bell, tone: 'warning' },
  { match: /assigned/i, icon: UserCheck, tone: 'warning' },
  { match: /progress|started/i, icon: Wrench, tone: 'accent' },
  { match: /resolved/i, icon: CircleCheck, tone: 'success' },
];

function resolveIcon(title) {
  return ICONS.find((i) => i.match.test(title)) || { icon: Bell, tone: 'info' };
}

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = diff / 60000;
  if (mins < 60) return `${Math.max(1, Math.round(mins))} min ago`;
  const hrs = mins / 60;
  if (hrs < 24) return `${Math.round(hrs)} hr ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
};

export default function RecentActivity({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <ul className="recent-activity">
      {items.map((item, i) => {
        const { icon: Icon, tone } = resolveIcon(item.title);
        return (
          <li
            key={item.id}
            className="recent-activity__item anim-fade-up"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <span className={`recent-activity__icon recent-activity__icon--${tone}`}>
              <Icon size={15} />
            </span>
            <span className="recent-activity__body">
              <span className="recent-activity__title">{item.title}</span>
              <span className="recent-activity__meta">{item.body} · {timeAgo(item.createdAt)}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
