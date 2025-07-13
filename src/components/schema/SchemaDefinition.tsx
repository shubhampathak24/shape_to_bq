import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { SchemaField } from '@/types';
import { Settings, Plus, X, Info } from 'lucide-react';

interface SchemaDefinitionProps {
  autoDetectSchema: boolean;
  onAutoDetectChange: (enabled: boolean) => void;
  customSchema: SchemaField[];
  onCustomSchemaChange: (schema: SchemaField[]) => void;
  integerColumns: string;
  onIntegerColumnsChange: (columns: string) => void;
  disabled?: boolean;
}

const SchemaDefinition: React.FC<SchemaDefinitionProps> = ({
  autoDetectSchema,
  onAutoDetectChange,
  customSchema = [], // Add default empty array
  onCustomSchemaChange,
  integerColumns = '', // Add default empty string
  onIntegerColumnsChange,
  disabled = false
}) => {
  const [newField, setNewField] = useState<SchemaField>({
    name: '',
    type: 'STRING',
    mode: 'NULLABLE'
  });

  const addField = () => {
    if (newField.name.trim()) {
      // Ensure customSchema is always an array
      const currentSchema = customSchema || [];
      onCustomSchemaChange([...currentSchema, { ...newField }]);
      setNewField({ name: '', type: 'STRING', mode: 'NULLABLE' });
    }
  };

  const removeField = (index: number) => {
    // Ensure customSchema is always an array
    const currentSchema = customSchema || [];
    const updated = currentSchema.filter((_, i) => i !== index);
    onCustomSchemaChange(updated);
  };

  const updateField = (index: number, field: SchemaField) => {
    // Ensure customSchema is always an array
    const currentSchema = customSchema || [];
    const updated = [...currentSchema];
    updated[index] = field;
    onCustomSchemaChange(updated);
  };

  const exampleSchema = `[
  {
    "name": "geometry",
    "type": "GEOGRAPHY",
    "mode": "REQUIRED"
  },
  {
    "name": "id",
    "type": "INTEGER",
    "mode": "REQUIRED"
  },
  {
    "name": "name",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "population",
    "type": "INTEGER", 
    "mode": "NULLABLE"
  }
]`;

  // Safely check if customSchema exists and has items
  const hasCustomFields = customSchema && Array.isArray(customSchema) && customSchema.length > 0;

  return (
    <Card data-id="f52xzou2z" data-path="src/components/schema/SchemaDefinition.tsx">
      <CardHeader data-id="bpxmfo2mc" data-path="src/components/schema/SchemaDefinition.tsx">
        <CardTitle className="flex items-center space-x-2" data-id="x0vndru7g" data-path="src/components/schema/SchemaDefinition.tsx">
          <Settings className="h-5 w-5" data-id="vwf75hv8j" data-path="src/components/schema/SchemaDefinition.tsx" />
          <span data-id="t7a58su58" data-path="src/components/schema/SchemaDefinition.tsx">Schema Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6" data-id="neukiwnqd" data-path="src/components/schema/SchemaDefinition.tsx">
        <div className="flex items-center justify-between" data-id="stnfaj2hh" data-path="src/components/schema/SchemaDefinition.tsx">
          <div className="space-y-1" data-id="g5vv6dn87" data-path="src/components/schema/SchemaDefinition.tsx">
            <Label htmlFor="auto-detect" data-id="cghxrgkrn" data-path="src/components/schema/SchemaDefinition.tsx">Auto-detect Schema</Label>
            <p className="text-sm text-gray-500" data-id="t07yjnfw1" data-path="src/components/schema/SchemaDefinition.tsx">
              Automatically infer schema from the shapefile
            </p>
          </div>
          <Switch
            id="auto-detect"
            checked={autoDetectSchema}
            onCheckedChange={onAutoDetectChange}
            disabled={disabled} data-id="ltgkxvhvj" data-path="src/components/schema/SchemaDefinition.tsx" />

        </div>

        {!autoDetectSchema &&
        <div className="space-y-4" data-id="rbbhgou34" data-path="src/components/schema/SchemaDefinition.tsx">
            <div data-id="37hbv4r0r" data-path="src/components/schema/SchemaDefinition.tsx">
              <Label data-id="akq78u56r" data-path="src/components/schema/SchemaDefinition.tsx">Custom Schema Definition</Label>
              <p className="text-sm text-gray-500 mb-2" data-id="c9pq9wtv6" data-path="src/components/schema/SchemaDefinition.tsx">
                Define the BigQuery table schema manually
              </p>
              
              {hasCustomFields &&
            <div className="space-y-2 mb-4" data-id="k37i8yqxt" data-path="src/components/schema/SchemaDefinition.tsx">
                  {customSchema.map((field, index) =>
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded" data-id="gttsowcni" data-path="src/components/schema/SchemaDefinition.tsx">
                      <Input
                  placeholder="Field name"
                  value={field.name || ''}
                  onChange={(e) => updateField(index, { ...field, name: e.target.value })}
                  className="flex-1" data-id="ny8otsn0g" data-path="src/components/schema/SchemaDefinition.tsx" />

                      <select
                  value={field.type}
                  onChange={(e) => updateField(index, { ...field, type: e.target.value as any })}
                  className="px-2 py-1 border rounded text-sm" data-id="911w9fkao" data-path="src/components/schema/SchemaDefinition.tsx">

                        <option value="STRING" data-id="rrmof9ujd" data-path="src/components/schema/SchemaDefinition.tsx">STRING</option>
                        <option value="INTEGER" data-id="lll8g4835" data-path="src/components/schema/SchemaDefinition.tsx">INTEGER</option>
                        <option value="FLOAT" data-id="aru7xfp7d" data-path="src/components/schema/SchemaDefinition.tsx">FLOAT</option>
                        <option value="BOOLEAN" data-id="rmscblz12" data-path="src/components/schema/SchemaDefinition.tsx">BOOLEAN</option>
                        <option value="TIMESTAMP" data-id="ot5t7bqwt" data-path="src/components/schema/SchemaDefinition.tsx">TIMESTAMP</option>
                        <option value="GEOGRAPHY" data-id="wt8vdujli" data-path="src/components/schema/SchemaDefinition.tsx">GEOGRAPHY</option>
                      </select>
                      <select
                  value={field.mode}
                  onChange={(e) => updateField(index, { ...field, mode: e.target.value as any })}
                  className="px-2 py-1 border rounded text-sm" data-id="vhhh5ilpo" data-path="src/components/schema/SchemaDefinition.tsx">

                        <option value="NULLABLE" data-id="wvp9837nu" data-path="src/components/schema/SchemaDefinition.tsx">NULLABLE</option>
                        <option value="REQUIRED" data-id="astjg26iq" data-path="src/components/schema/SchemaDefinition.tsx">REQUIRED</option>
                        <option value="REPEATED" data-id="6chlw8j5o" data-path="src/components/schema/SchemaDefinition.tsx">REPEATED</option>
                      </select>
                      <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(index)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700" data-id="evhz5smuq" data-path="src/components/schema/SchemaDefinition.tsx">

                        <X className="h-4 w-4" data-id="awwuje578" data-path="src/components/schema/SchemaDefinition.tsx" />
                      </Button>
                    </div>
              )}
                </div>
            }

              <div className="flex items-center space-x-2" data-id="nd865au1m" data-path="src/components/schema/SchemaDefinition.tsx">
                <Input
                placeholder="Field name"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                className="flex-1" data-id="dq4psk3ca" data-path="src/components/schema/SchemaDefinition.tsx" />

                <select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                className="px-2 py-1 border rounded text-sm" data-id="w73apd80e" data-path="src/components/schema/SchemaDefinition.tsx">

                  <option value="STRING" data-id="lp87kfoau" data-path="src/components/schema/SchemaDefinition.tsx">STRING</option>
                  <option value="INTEGER" data-id="bmeun19h3" data-path="src/components/schema/SchemaDefinition.tsx">INTEGER</option>
                  <option value="FLOAT" data-id="czwpgysxz" data-path="src/components/schema/SchemaDefinition.tsx">FLOAT</option>
                  <option value="BOOLEAN" data-id="76a06hvap" data-path="src/components/schema/SchemaDefinition.tsx">BOOLEAN</option>
                  <option value="TIMESTAMP" data-id="ro96zllj8" data-path="src/components/schema/SchemaDefinition.tsx">TIMESTAMP</option>
                  <option value="GEOGRAPHY" data-id="iweuo0mcf" data-path="src/components/schema/SchemaDefinition.tsx">GEOGRAPHY</option>
                </select>
                <Button onClick={addField} size="sm" data-id="2vyef725l" data-path="src/components/schema/SchemaDefinition.tsx">
                  <Plus className="h-4 w-4" data-id="ij9ns0wje" data-path="src/components/schema/SchemaDefinition.tsx" />
                </Button>
              </div>

              <Alert className="mt-4" data-id="uhme359ip" data-path="src/components/schema/SchemaDefinition.tsx">
                <Info className="h-4 w-4" data-id="433d2cpc3" data-path="src/components/schema/SchemaDefinition.tsx" />
                <AlertDescription data-id="l5hxkh797" data-path="src/components/schema/SchemaDefinition.tsx">
                  <strong data-id="tf4q2bwyw" data-path="src/components/schema/SchemaDefinition.tsx">Example schema:</strong>
                  <details className="mt-2" data-id="0es76pjdi" data-path="src/components/schema/SchemaDefinition.tsx">
                    <summary className="cursor-pointer text-sm font-medium" data-id="1vauclk19" data-path="src/components/schema/SchemaDefinition.tsx">
                      Click to see example
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto" data-id="rqkzm5x3q" data-path="src/components/schema/SchemaDefinition.tsx">
                      {exampleSchema}
                    </pre>
                  </details>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        }

        <div className="space-y-2" data-id="xh5b104sc" data-path="src/components/schema/SchemaDefinition.tsx">
          <Label htmlFor="integer-columns" data-id="sxpg9tk4b" data-path="src/components/schema/SchemaDefinition.tsx">Integer Columns (Optional)</Label>
          <Input
            id="integer-columns"
            placeholder="column1|column2|column3"
            value={integerColumns || ''}
            onChange={(e) => onIntegerColumnsChange(e.target.value)}
            disabled={disabled} data-id="rzf5jz4np" data-path="src/components/schema/SchemaDefinition.tsx" />

          <p className="text-sm text-gray-500" data-id="69lyet4r2" data-path="src/components/schema/SchemaDefinition.tsx">
            Pipe-separated list of columns to convert from string to integer
          </p>
        </div>
      </CardContent>
    </Card>);

};

export default SchemaDefinition;