import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Props {
  value: 'bigquery' | 'postgres';
  onChange: (val: 'bigquery' | 'postgres') => void;
}

const DestinationSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label>Destination</Label>
      <Select value={value} onValueChange={val => onChange(val as 'bigquery' | 'postgres')}>
        <SelectTrigger className="w-full dark:bg-zinc-800">
          <SelectValue placeholder="Choose destination" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bigquery">Google BigQuery</SelectItem>
          <SelectItem value="postgres">PostgreSQL</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DestinationSelector;
