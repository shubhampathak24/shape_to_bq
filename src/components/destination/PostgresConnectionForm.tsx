import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProcessingConfig } from '@/types';

interface Props {
  config: ProcessingConfig;
  onChange: (updated: Partial<ProcessingConfig>) => void;
}

const PostgresConnectionForm: React.FC<Props> = ({ config, onChange }) => {
  const handleField = (field: keyof ProcessingConfig) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'pgPort' ? Number(e.target.value) : e.target.value;
      onChange({ [field]: value } as Partial<ProcessingConfig>);
    };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="pgHost">Host</Label>
        <Input id="pgHost" value={config.pgHost} onChange={handleField('pgHost')} placeholder="localhost" />
      </div>
      <div>
        <Label htmlFor="pgPort">Port</Label>
        <Input id="pgPort" type="number" value={config.pgPort} onChange={handleField('pgPort')} placeholder="5432" />
      </div>
      <div>
        <Label htmlFor="pgDatabase">Database</Label>
        <Input id="pgDatabase" value={config.pgDatabase} onChange={handleField('pgDatabase')} placeholder="gis" />
      </div>
      <div>
        <Label htmlFor="pgUser">User</Label>
        <Input id="pgUser" value={config.pgUser} onChange={handleField('pgUser')} placeholder="postgres" />
      </div>
      <div>
        <Label htmlFor="pgPassword">Password</Label>
        <Input id="pgPassword" type="password" value={config.pgPassword} onChange={handleField('pgPassword')} />
      </div>
      <div>
        <Label htmlFor="pgTable">Target Table</Label>
        <Input id="pgTable" value={config.pgTable} onChange={handleField('pgTable')} placeholder="public.my_layer" />
      </div>
    </div>
  );
};

export default PostgresConnectionForm;
