import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartContainer } from './ChartContainer';
import { CHART_COLOR_ARRAY, formatNumber, truncateLabel } from './utils/chartUtils';

export interface BarChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface BaseBarChartProps {
  data: BarChartData[];
  title: string;
  subtitle?: string;
  dataKey?: string;
  nameKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  unit?: string;
  layout?: 'horizontal' | 'vertical';
  stacked?: boolean;
  multiBar?: Array<{ dataKey: string; name: string; color?: string }>;
  showLegend?: boolean;
  colorByValue?: boolean;
  height?: number;
}

export const BaseBarChart: React.FC<BaseBarChartProps> = ({
  data,
  title,
  subtitle,
  dataKey = 'value',
  nameKey = 'name',
  xAxisLabel,
  yAxisLabel,
  unit = '',
  layout = 'horizontal',
  stacked = false,
  multiBar,
  showLegend = false,
  colorByValue = false,
  height = 400
}) => {
  // Calcular el máximo valor para establecer el dominio correcto del eje Y
  const maxValue = React.useMemo(() => {
    if (multiBar) {
      // Para barras múltiples, calcular el máximo de todos los dataKeys
      return Math.max(
        ...data.map(item => 
          multiBar.reduce((sum, bar) => sum + (item[bar.dataKey] || 0), 0)
        )
      );
    } else {
      // Para barra única
      return Math.max(...data.map(item => item[dataKey] || 0));
    }
  }, [data, dataKey, multiBar]);

  // Si todos los valores son 0, establecer un máximo de 100 para que se vea el eje
  const yAxisDomain: [number, number | 'auto'] = maxValue === 0 ? [0, 100] : [0, 'auto'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].payload[nameKey]}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)} {unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderBars = () => {
    if (multiBar) {
      return multiBar.map((bar, index) => (
        <Bar
          key={bar.dataKey}
          dataKey={bar.dataKey}
          name={bar.name}
          fill={bar.color || CHART_COLOR_ARRAY[index]}
          stackId={stacked ? 'stack' : undefined}
          radius={[4, 4, 0, 0]}
        />
      ));
    }

    return (
      <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
        {colorByValue && data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={CHART_COLOR_ARRAY[index % CHART_COLOR_ARRAY.length]} />
        ))}
        {!colorByValue && <Cell fill={CHART_COLOR_ARRAY[0]} />}
      </Bar>
    );
  };

  return (
    <ChartContainer title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          
          {layout === 'horizontal' ? (
            <>
              <XAxis
                dataKey={nameKey}
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
                tickFormatter={(value) => truncateLabel(value, 15)}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
                tickFormatter={(value) => formatNumber(value, 0)}
                domain={yAxisDomain}
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined}
                tickFormatter={(value) => formatNumber(value, 0)}
                domain={yAxisDomain}
              />
              <YAxis
                type="category"
                dataKey={nameKey}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
                tickFormatter={(value) => truncateLabel(value, 15)}
                width={100}
              />
            </>
          )}
          
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {renderBars()}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
