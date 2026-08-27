"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CollapsibleSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 px-5 py-5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

/**
 * Two independent range inputs (Min / Max) rather than the classic
 * "overlapping dual-thumb" trick - that pattern relies on disabling
 * pointer-events on the whole track and re-enabling it only on the thumb
 * pseudo-element, which is unreliable across browsers and completely
 * breaks keyboard interaction (no mouseup/touchend event to hook into).
 * This version works with mouse, touch, and keyboard, and uses the
 * standards-based `accent-color` (Tailwind's `accent-*`) instead of a
 * custom thumb hack. Changes are debounced (not gated on release) so
 * dragging doesn't fire a request per pixel, but still commits reliably
 * however the value was changed.
 */
function PriceRangeFilter({ min, max, ceiling, onChange }) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalMin(min);
  }, [min]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalMax(max);
  }, [max]);

  const debouncedMin = useDebouncedValue(localMin, 450);
  const debouncedMax = useDebouncedValue(localMax, 450);

  useEffect(() => {
    if (debouncedMin !== min || debouncedMax !== max) {
      onChange(debouncedMin, debouncedMax);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, debouncedMax]);

  const minPercent = (localMin / ceiling) * 100;
  const maxPercent = (localMax / ceiling) * 100;
  const step = Math.max(1, Math.round(ceiling / 100));

  return (
    <div>
      <p className="font-semibold text-pink-600">
        {formatCurrency(localMin)} &ndash; {localMax >= ceiling ? `${formatCurrency(ceiling)}+` : formatCurrency(localMax)}
      </p>

      {/* decorative range indicator - purely visual, not interactive */}
      <div className="relative h-1.5 mt-4 mb-5 rounded-full bg-pink-100">
        <div
          className="absolute h-full rounded-full bg-pink-500"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Min</span>
            <span>{formatCurrency(localMin)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={ceiling}
            step={step}
            value={localMin}
            onChange={(e) => setLocalMin(Math.min(Number(e.target.value), localMax - step))}
            className="w-full accent-pink-500 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Max</span>
            <span>{localMax >= ceiling ? `${formatCurrency(ceiling)}+` : formatCurrency(localMax)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={ceiling}
            step={step}
            value={localMax}
            onChange={(e) => setLocalMax(Math.max(Number(e.target.value), localMin + step))}
            className="w-full accent-pink-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

function CheckboxList({ options, selected, onToggle, filterable = false }) {
  const [filter, setFilter] = useState("");
  const visible = filterable
    ? options.filter((o) => o.toLowerCase().includes(filter.toLowerCase()))
    : options;

  return (
    <div className="space-y-3">
      {filterable && options.length > 6 && (
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter..."
          className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      )}
      {visible.length === 0 ? (
        <p className="text-xs text-gray-400">None available.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {visible.map((option) => {
            const isChecked = selected.has(option);
            return (
              <li key={option} className="flex items-center justify-between py-2.5">
                <span className={isChecked ? "text-pink-600 font-medium text-sm" : "text-gray-700 text-sm"}>
                  {option}
                </span>
                <button
                  type="button"
                  onClick={() => onToggle(option)}
                  aria-pressed={isChecked}
                  aria-label={`Filter by ${option}`}
                  className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center ml-4 transition-colors ${
                    isChecked ? "bg-pink-500 border-pink-500" : "bg-white border-gray-300"
                  }`}
                >
                  {isChecked && <CheckIcon />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ProductFilterSidebar({
  search,
  onSearchChange,
  minPrice,
  maxPrice,
  priceCeiling = 20000,
  onPriceChange,
  brands = [],
  selectedBrands,
  onToggleBrand,
  categories,
  selectedCategories,
  onToggleCategory,
}) {
  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden h-fit">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search this collection..."
            className="w-full bg-gray-100 rounded-lg pl-9 pr-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
      </div>

      {categories && categories.length > 0 && (
        <CollapsibleSection title="Category">
          <CheckboxList
            options={categories.map((c) => c.name)}
            selected={new Set([...selectedCategories].map((id) => categories.find((c) => c._id === id)?.name))}
            onToggle={(name) => {
              const cat = categories.find((c) => c.name === name);
              if (cat) onToggleCategory(cat._id);
            }}
          />
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Price Range">
        <PriceRangeFilter min={minPrice} max={maxPrice} ceiling={priceCeiling} onChange={onPriceChange} />
      </CollapsibleSection>

      <CollapsibleSection title="Filter by Brand">
        <CheckboxList options={brands} selected={selectedBrands} onToggle={onToggleBrand} filterable />
      </CollapsibleSection>
    </aside>
  );
}
