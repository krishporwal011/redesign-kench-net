"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { familyName } from "@/lib/labels";
import { BUYER_HUB, HOUSE_PLACE, kmFromHub, placeGeo } from "@/lib/places";
import { loadPiles } from "@/lib/store";

type LeafletNs = {
  map: (el: HTMLElement, opts: object) => {
    remove: () => void;
    fitBounds: (b: unknown, opts?: object) => void;
  };
  tileLayer: (url: string, opts: object) => { addTo: (m: unknown) => void };
  circleMarker: (
    latlng: [number, number],
    opts: object,
  ) => { addTo: (m: unknown) => unknown; bindPopup: (html: string) => void };
  featureGroup: (layers: unknown[]) => { getBounds: () => unknown };
};

function loadLeaflet(): Promise<LeafletNs> {
  const w = window as Window & { L?: LeafletNs };
  if (w.L) return Promise.resolve(w.L);
  return new Promise((resolve, reject) => {
    if (!document.getElementById("kn-leaflet-css")) {
      const link = document.createElement("link");
      link.id = "kn-leaflet-css";
      link.rel = "stylesheet";
      link.href = "/leaflet/leaflet.css";
      document.head.appendChild(link);
    }
    const existing = document.getElementById("kn-leaflet-js") as HTMLScriptElement | null;
    const finish = () => {
      const L = (window as Window & { L?: LeafletNs }).L;
      if (L) resolve(L);
      else reject(new Error("leaflet"));
    };
    if (existing) {
      if (w.L) finish();
      else existing.addEventListener("load", finish, { once: true });
      existing.addEventListener("error", () => reject(new Error("leaflet")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.id = "kn-leaflet-js";
    script.src = "/leaflet/leaflet.js";
    script.onload = finish;
    script.onerror = () => reject(new Error("leaflet"));
    document.body.appendChild(script);
  });
}

export default function FirozabadMap() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const pins = useMemo(() => {
    const piles = loadPiles();
    const byPlace = new Map<string, string[]>();
    for (const pile of piles) {
      const place = pile.locality || HOUSE_PLACE[pile.householdId] || "Ramnagar";
      const names = byPlace.get(place) ?? [];
      const name = familyName(pile.householdId, "en");
      if (!names.includes(name)) names.push(name);
      byPlace.set(place, names);
    }
    const rows = [...byPlace.entries()].map(([locality, families]) => ({
      locality,
      families,
      km: kmFromHub(locality),
      geo: placeGeo(locality),
    }));
    rows.sort((a, b) => a.km - b.km);
    return rows;
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let map: { remove: () => void } | null = null;
    let alive = true;
    loadLeaflet()
      .then((L) => {
        if (!alive || !host.current) return;
        try {
          const created = L.map(host.current, {
            scrollWheelZoom: false,
            zoomControl: true,
          });
          map = created;
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap",
            maxZoom: 18,
          }).addTo(created);
          const hub = placeGeo(BUYER_HUB);
          const layers: unknown[] = [];
          const hubMark = L.circleMarker([hub.lat, hub.lng], {
            radius: 14,
            color: "#9e2a1b",
            fillColor: "#9e2a1b",
            fillOpacity: 0.95,
          });
          hubMark.addTo(created);
          hubMark.bindPopup(`${BUYER_HUB} · Buyer Mandi Hub`);
          layers.push(hubMark);
          for (const pin of pins) {
            const mark = L.circleMarker([pin.geo.lat, pin.geo.lng], {
              radius: 11,
              color: "#9e2a1b",
              fillColor: "#fbf7f0",
              fillOpacity: 0.95,
              weight: 3,
            });
            mark.addTo(created);
            mark.bindPopup(
              `<strong>${pin.locality}</strong> · ~${pin.km} km<br/>Households: ${pin.families.slice(0, 6).join(", ")}`,
            );
            layers.push(mark);
          }
          created.fitBounds(L.featureGroup(layers).getBounds(), {
            padding: [28, 28],
          });
          window.setTimeout(() => {
            try {
              (created as { invalidateSize?: () => void }).invalidateSize?.();
            } catch {
              /* ignore */
            }
          }, 80);
          if (alive) setReady(true);
        } catch {
          if (alive) setFailed(true);
        }
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
      map?.remove();
    };
  }, [pins]);

  return (
    <div className="space-y-4">
      <div ref={host} className="h-72 rounded-2xl border border-[#eadecf] bg-[#fffdf9] shadow-sm overflow-hidden" />
      {!ready && !failed ? (
        <p className="text-xs text-[#523a2f] text-center">Loading Firozabad Mandi Map...</p>
      ) : null}
      {failed ? (
        <div className="p-4 rounded-2xl bg-[#fffdf9] border border-[#eadecf] text-left">
          <p className="text-sm font-bold text-[#2c1a14]">Firozabad Mandi Hub Map (Schematic)</p>
          <p className="text-xs text-[#523a2f] mt-1">
            Buyer Mandi located centrally. Nearby artisan household clusters prioritized by distance.
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#785d4f] uppercase tracking-wider">Locality Distance Hierarchy</h3>
        <div className="space-y-2">
          <div className="kn-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="kn-dot kn-dot-red" />
              <div>
                <p className="text-xs font-extrabold text-[#9e2a1b]">{BUYER_HUB}</p>
                <p className="text-[11px] text-[#523a2f]">Central Buyer Mandi Hub</p>
              </div>
            </div>
            <span className="kn-badge kn-badge-warning font-mono text-xs">0 km</span>
          </div>

          {pins.map((pin) => (
            <div key={pin.locality} className="kn-card p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="kn-dot kn-dot-red" />
                <div>
                  <p className="text-xs font-bold text-[#2c1a14]">{pin.locality}</p>
                  <p className="text-[11px] text-[#523a2f]">{pin.families.join(" · ")}</p>
                </div>
              </div>
              <span className="kn-badge kn-badge-neutral font-mono text-xs">~{pin.km} km</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
