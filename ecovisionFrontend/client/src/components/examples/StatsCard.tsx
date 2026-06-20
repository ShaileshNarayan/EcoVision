import { StatsCard } from '../StatsCard';
import { ClipboardList } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <StatsCard
        title="Total Reports"
        value="1,234"
        icon={ClipboardList}
        description="+12% from last month"
      />
    </div>
  );
}
