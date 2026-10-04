import citizenImage from '../assets/citizen.png';
import authorityImage from '../assets/authority.png';
import workerImage from '../assets/worker.png';
import { User, Landmark, HardHat } from 'lucide-react';

export const roles = [
  {
    id: 'citizen',
    title: 'Citizen',
    image: citizenImage,
    Icon: User,
    description: 'Report issues in your area and track their progress in real time.',
    action: 'Continue as Citizen',
  },
  {
    id: 'authority',
    title: 'Authority',
    image: authorityImage,
    Icon: Landmark,
    description: 'Review incoming reports, assign them, and monitor resolution.',
    action: 'Continue as Authority',
  },
  {
    id: 'worker',
    title: 'Worker',
    image: workerImage,
    Icon: HardHat,
    description: 'Receive assigned tasks on the ground and mark issues resolved.',
    action: 'Continue as Worker',
  },
];
