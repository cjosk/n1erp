'use client';

interface Props {
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
}

const DateRangeFilter = ({ startDate, endDate, onChange }: Props) => {
  return (
    <div className="glass-card rounded-2xl border border-white/40 p-4 flex flex-col md:flex-row md:items-end gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Başlangıç Tarihi</label>
        <input
          type="date"
          value={startDate}
          onChange={(event) => onChange({ startDate: event.target.value, endDate })}
          className="rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bitiş Tarihi</label>
        <input
          type="date"
          value={endDate}
          onChange={(event) => onChange({ startDate, endDate: event.target.value })}
          className="rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
