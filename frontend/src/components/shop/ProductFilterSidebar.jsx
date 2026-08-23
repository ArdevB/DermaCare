"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { formatCurrency } from "@/lib/format";

function CheckIcon() {
  return (
    <svg
      className="w-3 h-3 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
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
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

/**
 * Dual-thumb price range slider. Reports changes only on release (mouseup /
 * touchend), not on every drag tick, so it doesn't hammer the API with a
 * request per pixel of movement.
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

  const commit = (nextMin, nextMax) => onChange(nextMin, nextMax);

  const minPercent = (localMin / ceiling) * 100;
  const maxPercent = (localMax / ceiling) * 100;

  return (
    <div>
      <p className="font-semibold text-pink-600">
        {formatCurrency(localMin)} &ndash;{" "}
        {localMax >= ceiling
          ? `${formatCurrency(ceiling)}+`
          : formatCurrency(localMax)}
      </p>
      <div className="relative h-2 mt-5 mb-1">
        <div className="absolute inset-0 rounded-full bg-pink-100" />
        <div
          className="absolute h-full rounded-full bg-pink-500"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={ceiling}
          step={ceiling / 100}
          value={localMin}
          onChange={(e) =>
            setLocalMin(Math.min(Number(e.target.value), localMax - 1))
          }
          onMouseUp={() => commit(localMin, localMax)}
          onTouchEnd={() => commit(localMin, localMax)}
          className="range-thumb absolute w-full appearance-none bg-transparent pointer-events-none"
        />
        <input
          type="range"
          min={0}
          max={ceiling}
          step={ceiling / 100}
          value={localMax}
          onChange={(e) =>
            setLocalMax(Math.max(Number(e.target.value), localMin + 1))
          }
          onMouseUp={() => commit(localMin, localMax)}
          onTouchEnd={() => commit(localMin, localMax)}
          className="range-thumb absolute w-full appearance-none bg-transparent pointer-events-none"
        />
      </div>
      <style jsx>{`
        .range-thumb::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #ec4899;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #ec4899;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
      `}</style>
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
              <li
                key={option}
                className="flex items-center justify-between py-2.5"
              >
                <span
                  className={
                    isChecked
                      ? "text-pink-600 font-medium text-sm"
                      : "text-gray-700 text-sm"
                  }
                >
                  {option}
                </span>
                <button
                  type="button"
                  onClick={() => onToggle(option)}
                  aria-pressed={isChecked}
                  aria-label={`Filter by ${option}`}
                  className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center ml-4 transition-colors ${
                    isChecked
                      ? "bg-pink-500 border-pink-500"
                      : "bg-white border-gray-300"
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
            selected={
              new Set(
                [...selectedCategories].map(
                  (id) => categories.find((c) => c._id === id)?.name,
                ),
              )
            }
            onToggle={(name) => {
              const cat = categories.find((c) => c.name === name);
              if (cat) onToggleCategory(cat._id);
            }}
          />
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Price Range">
        <PriceRangeFilter
          min={minPrice}
          max={maxPrice}
          ceiling={priceCeiling}
          onChange={onPriceChange}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Filter by Brand">
        <CheckboxList
          options={brands}
          selected={selectedBrands}
          onToggle={onToggleBrand}
          filterable
        />
      </CollapsibleSection>
    </aside>
  );
}
