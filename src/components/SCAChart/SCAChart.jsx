import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

export default function SCAChart({ data }) {
  return (
    <RadarChart width={350} height={300} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="name" />
      <PolarRadiusAxis domain={[0, 10]} />
      <Radar dataKey="value" fill="#7b3f00" fillOpacity={0.6} />
    </RadarChart>
  );
}
