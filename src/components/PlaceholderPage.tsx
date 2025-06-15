
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-slate-400">{description}</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center gap-2">
            <Construction className="w-5 h-5" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">
            This module is currently under development and will be available in a future release.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
