'use client';

interface StatCardProps {
  icon: string;
  title: string;
  value: number | string;
  suffix?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export default function StatCard({ icon, title, value, suffix = '', color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-3xl">{icon}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
      </div>
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>
        {value}{suffix}
      </div>
    </div>
  );
}
