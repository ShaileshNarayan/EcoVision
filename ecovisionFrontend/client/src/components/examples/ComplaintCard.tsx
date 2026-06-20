import { ComplaintCard } from '../ComplaintCard';

export default function ComplaintCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <ComplaintCard
        id="1"
        title="Illegal dumping on Park Avenue"
        description="Large amount of construction waste dumped near the playground area. Needs immediate attention."
        wasteType="Construction Waste"
        status="pending"
        location="Park Avenue, District 5"
        imageUrl="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800"
        createdAt="2 days ago"
      />
    </div>
  );
}
