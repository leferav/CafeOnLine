import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoteForm.css";

import SCAChart from "../SCAChart/SCAChart";
import { useI18n } from "../../i18n/i18n";
import { getLotById, upsertLot } from "../../lib/storage";
import { nyMockUsd, sumDiff, computeTotals, convertCurrency, fxMock } from "../../lib/pricing";

const REGIONS = [
  "Cerrado Mineiro",
  "Sul de Minas",
  "Matas de Minas",
  "Mogiana",
  "Espírito Santo",
  "Bahia",
  "Colômbia",
  "Etiópia",
  "Outro",
];

const PACKAGING_TYPES = [
  "Saca 60kg",
  "Saca 30kg",
  "Big Bag",
  "Bulk",
];

const PROCESS_OPTIONS = ["Natural", "CD", "Washed", "Honey", "Fermentado", "Outro"];
const HARVEST_OPTIONS = ["Manual", "Mecânica", "Seletiva"];
const DRYING_OPTIONS = ["Terreiro concreto", "Terreiro suspenso", "Secador", "Terreiro concreto + Secador"];

const BEVERAGE_OPTIONS = [
  "Estritamente Mole",
  "Mole",
  "Apenas Mole",
  "Duro",
  "Riado",
  "Rio",
  "Especial / Specialty",
  "Outro",
];

const SIEVE_OPTIONS = ["13", "14", "15", "16", "17", "18", "19", "20", "Peaberry / Moca", "Outro"];

const VARIETY_OPTIONS = [
  "Catuaí",
  "Mundo Novo",
  "Bourbon",
  "Arara",
  "Topázio",
  "Icatu",
  "Geisha",
  "Laurina",
  "Outro",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SCA_FIELDS = [
  { key: "aroma", pt: "Aroma", en: "Aroma" },
  { key: "flavor", pt: "Sabor", en: "Flavor" },
  { key: "aftertaste", pt: "Finalização", en: "Aftertaste" },
  { key: "acidity", pt: "Acidez", en: "Acidity" },
  { key: "body", pt: "Corpo", en: "Body" },
  { key: "balance", pt: "Equilíbrio", en: "Balance" },
  { key: "sweetness", pt: "Doçura", en: "Sweetness" },
  { key: "uniformity", pt: "Uniformidade", en: "Uniformity" },
  { key: "cleanCup", pt: "Limpeza", en: "Clean Cup" },
  { key: "overall", pt: "Impressão Geral", en: "Overall" },
];

function emptyLot() {
  return {
    id: crypto.randomUUID(),
    internalCode: "",
    lotName: "",
    region: "",
    originWarehouse: "",
    availableWarehouse: "",
    packaging: { type: "", withGP: false },
    varieties: [],
    sieves: "",
    beverage: "",
    process: "",
    harvestType: "",
    drying: "",
    harvestWindow: { from: "", to: "" },
    description: { pt: "", en: "" },
    farm: {
      farmName: "",
      producerName: "",
      altitude: "",
      address: "",
      carCode: "",
      fixedEmployees: "",
      tempEmployees: "",
      history: "",
    },
    offer: {
      quantityAvailable: "",
      quantityMin: "",
      salesMode: "sack", // sack | container
      spot: true,
      ship: { enabled: false, shipMonth: "", nyMonth: "Mar" },
    },
    pricing: {
      priceType: "toFix", // fixed | toFix
      fixationOption: "seller", // seller | buyer
      nyBaseUsdPerLb: "", // can be overridden
      coffeeDiff: "",
      originLogDiff: "",
      destLogDiff: "",
      loadingDiff: "",
      displayCurrency: "USD",
    },
    sca: {
      scores: Object.fromEntries(SCA_FIELDS.map((f) => [f.key, 7.5])),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function isFilled(v) {
  return String(v ?? "").trim().length > 0;
}

export default function LoteForm({ mode = "create", lotId }) {
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const [lot, setLot] = useState(() => emptyLot());
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (mode === "edit" && lotId) {
      const existing = getLotById(lotId);
      if (existing) setLot(existing);
    }
  }, [mode, lotId]);

  const finalDiff = useMemo(() => sumDiff(lot.pricing), [lot.pricing]);

  const nyMonth = lot.offer?.ship?.nyMonth || "Mar";
  const nySuggested = nyMockUsd[nyMonth] ?? 0;

  const nyBase = useMemo(() => {
    const manual = Number(lot.pricing?.nyBaseUsdPerLb);
    if (!Number.isNaN(manual) && isFilled(lot.pricing?.nyBaseUsdPerLb)) return manual;
    return nySuggested;
  }, [lot.pricing?.nyBaseUsdPerLb, nySuggested]);

  const totals = useMemo(
    () => computeTotals({ nyBaseUsdPerLb: nyBase, finalDiffUsdPerLb: finalDiff }),
    [nyBase, finalDiff]
  );

  const currency = lot.pricing?.displayCurrency || "USD";
  const totalsConverted = useMemo(() => {
    if (currency === "USD") return null;
    return {
      perKg: convertCurrency(totals.perKg, currency),
      perSack60: convertCurrency(totals.perSack60, currency),
      perSack30: convertCurrency(totals.perSack30, currency),
      perTon: convertCurrency(totals.perTon, currency),
    };
  }, [totals, currency]);

  const scaChartData = useMemo(() => {
    return SCA_FIELDS.map((f) => ({
      name: lang === "en" ? f.en : f.pt,
      value: Number(lot.sca?.scores?.[f.key] ?? 0),
    }));
  }, [lot.sca?.scores, lang]);

  const scaTotal = useMemo(() => {
    const vals = SCA_FIELDS.map((f) => Number(lot.sca?.scores?.[f.key] ?? 0));
    const avg = vals.reduce((a, b) => a + b, 0) / Math.max(vals.length, 1);
    // escala aproximada (0–10) -> (0–100)
    return avg * 10;
  }, [lot.sca?.scores]);

  useEffect(() => {
    setLot((prev) => ({
      ...prev,
      sca: { ...prev.sca, totalScore: scaTotal, chartData: scaChartData },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scaTotal, lang]);

  function setField(path, value) {
    setLot((prev) => {
      const next = structuredClone(prev);
      let cur = next;
      const parts = path.split(".");
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      next.updatedAt = new Date().toISOString();
      return next;
    });
  }

  function toggleInArray(path, item) {
    setLot((prev) => {
      const next = structuredClone(prev);
      let cur = next;
      const parts = path.split(".");
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      const key = parts[parts.length - 1];
      const arr = Array.isArray(cur[key]) ? cur[key] : [];
      cur[key] = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
      next.updatedAt = new Date().toISOString();
      return next;
    });
  }

  function validate() {
    const e = {};
    if (!isFilled(lot.internalCode)) e.internalCode = t("required");
    if (!isFilled(lot.lotName)) e.lotName = t("required");
    if (!isFilled(lot.region)) e.region = t("required");
    if (!isFilled(lot.originWarehouse)) e.originWarehouse = t("required");
    if (!isFilled(lot.availableWarehouse)) e.availableWarehouse = t("required");
    if (!isFilled(lot.packaging?.type)) e.packagingType = t("required");
    if (!isFilled(lot.offer?.quantityAvailable)) e.quantityAvailable = t("required");
    if (!isFilled(lot.offer?.quantityMin)) e.quantityMin = t("required");

    if (lot.offer?.ship?.enabled) {
      if (!isFilled(lot.offer.ship.shipMonth)) e.shipMonth = t("required");
      if (!isFilled(lot.offer.ship.nyMonth)) e.nyMonth = t("required");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSave() {
    if (!validate()) {
      setToast(t("invalidForm"));
      return;
    }

    const lotToSave = {
      ...lot,
      sca: {
        ...lot.sca,
        totalScore: scaTotal,
        chartData: scaChartData,
      },
    };

    upsertLot(lotToSave);
    setToast(t("lotSaved"));
    setTimeout(() => navigate("/lotes"), 250);
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 style={{ margin: 0 }}>{mode === "edit" ? `${t("edit")} ${t("newLot")}` : t("newLot")}</h1>
          <div className="muted" style={{ marginTop: 4 }}>
            Admin interno (um único acesso) • PT/EN • Cadastro completo do lote
          </div>
        </div>
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate("/lotes")}>
            {t("cancel")}
          </button>
          <button className="btn" type="button" onClick={onSave}>
            {t("save")}
          </button>
        </div>
      </div>

      {toast ? <div className="toast">{toast}</div> : null}

      {/* Identificação */}
      <section className="card">
        <h2>{t("sectionIdentification")}</h2>

        <div className="grid-3">
          <div className="field">
            <label>{t("internalCode")} *</label>
            <input value={lot.internalCode} onChange={(e) => setField("internalCode", e.target.value)} />
            {errors.internalCode ? <span className="error">{errors.internalCode}</span> : null}
          </div>

          <div className="field">
            <label>{t("lotName")} *</label>
            <input value={lot.lotName} onChange={(e) => setField("lotName", e.target.value)} />
            {errors.lotName ? <span className="error">{errors.lotName}</span> : null}
          </div>

          <div className="field">
            <label>{t("region")} *</label>
            <select value={lot.region} onChange={(e) => setField("region", e.target.value)}>
              <option value="">{t("region")}</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.region ? <span className="error">{errors.region}</span> : null}
          </div>
        </div>
      </section>

      {/* Origem */}
      <section className="card">
        <h2>{t("sectionOrigin")}</h2>

        <div className="grid-2">
          <div className="field">
            <label>{t("originWarehouse")} *</label>
            <input value={lot.originWarehouse} onChange={(e) => setField("originWarehouse", e.target.value)} />
            {errors.originWarehouse ? <span className="error">{errors.originWarehouse}</span> : null}
          </div>

          <div className="field">
            <label>{t("availableWarehouse")} *</label>
            <input value={lot.availableWarehouse} onChange={(e) => setField("availableWarehouse", e.target.value)} />
            {errors.availableWarehouse ? <span className="error">{errors.availableWarehouse}</span> : null}
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: 12 }}>
          <div className="field">
            <label>{t("packaging")} *</label>
            <select value={lot.packaging.type} onChange={(e) => setField("packaging.type", e.target.value)}>
              <option value="">{t("packaging")}</option>
              {PACKAGING_TYPES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.packagingType ? <span className="error">{errors.packagingType}</span> : null}
          </div>

          <div className="field checkbox">
            <label>{t("withGP")}</label>
            <input
              type="checkbox"
              checked={!!lot.packaging.withGP}
              onChange={(e) => setField("packaging.withGP", e.target.checked)}
            />
          </div>

          <div className="field">
            <label>{t("sieves")}</label>
            <select value={lot.sieves} onChange={(e) => setField("sieves", e.target.value)}>
              <option value="">{t("sieves")}</option>
              {SIEVE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="card">
        <h2>{t("sectionCoffee")}</h2>

        <div className="grid-3">
          <div className="field">
            <label>{t("process")}</label>
            <select value={lot.process} onChange={(e) => setField("process", e.target.value)}>
              <option value="">{t("process")}</option>
              {PROCESS_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>{t("harvestType")}</label>
            <select value={lot.harvestType} onChange={(e) => setField("harvestType", e.target.value)}>
              <option value="">{t("harvestType")}</option>
              {HARVEST_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>{t("drying")}</label>
            <select value={lot.drying} onChange={(e) => setField("drying", e.target.value)}>
              <option value="">{t("drying")}</option>
              {DRYING_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: 12 }}>
          <div className="field">
            <label>{t("beverage")}</label>
            <select value={lot.beverage} onChange={(e) => setField("beverage", e.target.value)}>
              <option value="">{t("beverage")}</option>
              {BEVERAGE_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>{t("varieties")} ({t("optional")})</label>
            <div className="pillbox">
              {VARIETY_OPTIONS.map((v) => (
                <label key={v} className={"pill" + (lot.varieties.includes(v) ? " active" : "")}>
                  <input
                    type="checkbox"
                    checked={lot.varieties.includes(v)}
                    onChange={() => toggleInArray("varieties", v)}
                  />
                  {v}
                </label>
              ))}
            </div>
            <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
              Pode ser mais de uma variedade — ou nenhuma.
            </div>
          </div>
        </div>
      </section>

      {/* Fazenda / Produtor */}
      <section className="card">
        <h2>{t("sectionFarm")}</h2>

        <div className="grid-2">
          <div className="field">
            <label>{t("farmName")} ({t("optional")})</label>
            <input value={lot.farm.farmName} onChange={(e) => setField("farm.farmName", e.target.value)} />
          </div>

          <div className="field">
            <label>{t("producerName")} ({t("optional")})</label>
            <input value={lot.farm.producerName} onChange={(e) => setField("farm.producerName", e.target.value)} />
          </div>
        </div>

        {isFilled(lot.farm.farmName) ? (
          <div style={{ marginTop: 12 }}>
            <div className="grid-3">
              <div className="field">
                <label>{t("altitude")}</label>
                <input value={lot.farm.altitude} onChange={(e) => setField("farm.altitude", e.target.value)} />
              </div>
              <div className="field">
                <label>{t("carCode")}</label>
                <input value={lot.farm.carCode} onChange={(e) => setField("farm.carCode", e.target.value)} />
              </div>
              <div className="field">
                <label>{t("fixedEmployees")}</label>
                <input value={lot.farm.fixedEmployees} onChange={(e) => setField("farm.fixedEmployees", e.target.value)} />
              </div>
            </div>

            <div className="grid-2" style={{ marginTop: 12 }}>
              <div className="field">
                <label>{t("tempEmployees")}</label>
                <input value={lot.farm.tempEmployees} onChange={(e) => setField("farm.tempEmployees", e.target.value)} />
              </div>
              <div className="field">
                <label>{t("address")}</label>
                <input value={lot.farm.address} onChange={(e) => setField("farm.address", e.target.value)} />
              </div>
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label>{t("farmHistory")}</label>
              <textarea
                rows={4}
                value={lot.farm.history}
                onChange={(e) => setField("farm.history", e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
            Preencha o nome da fazenda para habilitar os campos adicionais (altitude, CAR, funcionários, histórico…).
          </div>
        )}
      </section>

      {/* Descrição */}
      <section className="card">
        <h2>{t("sectionDescription")}</h2>
        <div className="grid-2">
          <div className="field">
            <label>{t("descriptionPT")}</label>
            <textarea rows={5} value={lot.description.pt} onChange={(e) => setField("description.pt", e.target.value)} />
          </div>
          <div className="field">
            <label>{t("descriptionEN")}</label>
            <textarea rows={5} value={lot.description.en} onChange={(e) => setField("description.en", e.target.value)} />
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section className="card">
        <h2>{t("sectionOffer")}</h2>

        <div className="grid-2">
          <div className="field">
            <label>{t("harvestWindow")}</label>
            <div className="inline">
              <select value={lot.harvestWindow.from} onChange={(e) => setField("harvestWindow.from", e.target.value)}>
                <option value="">{t("monthFrom")}</option>
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={lot.harvestWindow.to} onChange={(e) => setField("harvestWindow.to", e.target.value)}>
                <option value="">{t("monthTo")}</option>
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label>{t("salesMode")}</label>
            <select value={lot.offer.salesMode} onChange={(e) => setField("offer.salesMode", e.target.value)}>
              <option value="sack">{t("salesModeSack")}</option>
              <option value="container">{t("salesModeContainer")}</option>
            </select>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: 12 }}>
          <div className="field">
            <label>{t("quantityAvailable")} *</label>
            <input
              value={lot.offer.quantityAvailable}
              onChange={(e) => setField("offer.quantityAvailable", e.target.value)}
              placeholder="Ex.: 200 (sacas) ou 12000 (kg)"
            />
            {errors.quantityAvailable ? <span className="error">{errors.quantityAvailable}</span> : null}
          </div>
          <div className="field">
            <label>{t("quantityMin")} *</label>
            <input
              value={lot.offer.quantityMin}
              onChange={(e) => setField("offer.quantityMin", e.target.value)}
              placeholder="Ex.: 1 saca / 1 container"
            />
            {errors.quantityMin ? <span className="error">{errors.quantityMin}</span> : null}
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: 12 }}>
          <div className="field checkbox">
            <label>{t("spotAvailable")}</label>
            <input type="checkbox" checked={!!lot.offer.spot} onChange={(e) => setField("offer.spot", e.target.checked)} />
          </div>

          <div className="field checkbox">
            <label>{t("shipAvailable")}</label>
            <input
              type="checkbox"
              checked={!!lot.offer.ship.enabled}
              onChange={(e) => setField("offer.ship.enabled", e.target.checked)}
            />
          </div>

          <div className="muted" style={{ fontSize: 12, alignSelf: "center" }}>
            Se “a embarcar”, informe o mês de embarque e o mês do contrato NY.
          </div>
        </div>

        {lot.offer.ship.enabled ? (
          <div className="grid-3" style={{ marginTop: 12 }}>
            <div className="field">
              <label>{t("shipMonth")} *</label>
              <select value={lot.offer.ship.shipMonth} onChange={(e) => setField("offer.ship.shipMonth", e.target.value)}>
                <option value="">{t("shipMonth")}</option>
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.shipMonth ? <span className="error">{errors.shipMonth}</span> : null}
            </div>

            <div className="field">
              <label>{t("nyMonth")} *</label>
              <select value={lot.offer.ship.nyMonth} onChange={(e) => setField("offer.ship.nyMonth", e.target.value)}>
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.nyMonth ? <span className="error">{errors.nyMonth}</span> : null}
            </div>

            <div className="field">
              <label>{t("nyBase")} (USD/lb)</label>
              <input
                value={lot.pricing.nyBaseUsdPerLb}
                onChange={(e) => setField("pricing.nyBaseUsdPerLb", e.target.value)}
                placeholder={`Sugestão: ${nySuggested}`}
              />
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                Sugestão MOCK por mês ({nyMonth}): {nySuggested}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Preço */}
      <section className="card">
        <h2>{t("sectionPricing")}</h2>

        <div className="grid-3">
          <div className="field">
            <label>{t("priceType")}</label>
            <select value={lot.pricing.priceType} onChange={(e) => setField("pricing.priceType", e.target.value)}>
              <option value="toFix">{t("toFix")}</option>
              <option value="fixed">{t("fixed")}</option>
            </select>
          </div>

          <div className="field">
            <label>{t("fixationOption")}</label>
            <select value={lot.pricing.fixationOption} onChange={(e) => setField("pricing.fixationOption", e.target.value)}>
              <option value="seller">{t("seller")}</option>
              <option value="buyer">{t("buyer")}</option>
            </select>
          </div>

          <div className="field">
            <label>{t("currency")}</label>
            <select value={currency} onChange={(e) => setField("pricing.displayCurrency", e.target.value)}>
              {Object.keys(fxMock).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Conversão automática usando taxa MOCK (ajustável depois).
            </div>
          </div>
        </div>

        <div className="grid-4" style={{ marginTop: 12 }}>
          <div className="field">
            <label>{t("coffeeDiff")}</label>
            <input value={lot.pricing.coffeeDiff} onChange={(e) => setField("pricing.coffeeDiff", e.target.value)} placeholder="Ex.: 0.35" />
          </div>
          <div className="field">
            <label>{t("originLogDiff")}</label>
            <input value={lot.pricing.originLogDiff} onChange={(e) => setField("pricing.originLogDiff", e.target.value)} placeholder="Ex.: 0.10" />
          </div>
          <div className="field">
            <label>{t("destLogDiff")}</label>
            <input value={lot.pricing.destLogDiff} onChange={(e) => setField("pricing.destLogDiff", e.target.value)} placeholder="Ex.: 0.05" />
          </div>
          <div className="field">
            <label>{t("loadingDiff")}</label>
            <input value={lot.pricing.loadingDiff} onChange={(e) => setField("pricing.loadingDiff", e.target.value)} placeholder="Ex.: 0.02" />
          </div>
        </div>

        <div className="summary" style={{ marginTop: 14 }}>
          <div><strong>{t("finalDiff")}:</strong> {finalDiff.toFixed(2)}</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Assumimos: preços em <strong>USD/lb</strong> para conversões de unidade (ajuste depois conforme sua regra real).
          </div>

          <div className="units">
            <div><strong>USD</strong> {totals.perKg.toFixed(2)} {t("perKg")}</div>
            <div><strong>USD</strong> {totals.perSack60.toFixed(2)} {t("perSack60")}</div>
            <div><strong>USD</strong> {totals.perSack30.toFixed(2)} {t("perSack30")}</div>
            <div><strong>USD</strong> {totals.perTon.toFixed(2)} {t("perTon")}</div>
          </div>

          {totalsConverted ? (
            <div className="units" style={{ marginTop: 8 }}>
              <div><strong>{currency}</strong> {totalsConverted.perKg.toFixed(2)} {t("perKg")}</div>
              <div><strong>{currency}</strong> {totalsConverted.perSack60.toFixed(2)} {t("perSack60")}</div>
              <div><strong>{currency}</strong> {totalsConverted.perSack30.toFixed(2)} {t("perSack30")}</div>
              <div><strong>{currency}</strong> {totalsConverted.perTon.toFixed(2)} {t("perTon")}</div>
            </div>
          ) : null}
        </div>
      </section>

      {/* SCA */}
      <section className="card">
        <h2>{t("sectionSCA")}</h2>

        <div className="sca">
          <div className="sca-left">
            <div className="grid-2">
              {SCA_FIELDS.map((f) => (
                <div key={f.key} className="field">
                  <label>{lang === "en" ? f.en : f.pt} (0–10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.25"
                    value={lot.sca.scores[f.key]}
                    onChange={(e) => setField(`sca.scores.${f.key}`, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="summary" style={{ marginTop: 12 }}>
              <div><strong>{t("scaTotal")}:</strong> {scaTotal.toFixed(2)}</div>
              <div className="muted" style={{ marginTop: 6 }}>
                Nota final é uma escala aproximada (média 0–10 × 10). Você pode adaptar para o cálculo oficial depois.
              </div>
            </div>
          </div>

          <div className="sca-right">
            <SCAChart data={scaChartData} />
          </div>
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 24 }}>
        <button className="btn secondary" type="button" onClick={() => navigate("/lotes")}>
          {t("cancel")}
        </button>
        <button className="btn" type="button" onClick={onSave}>
          {t("save")}
        </button>
      </div>
    </div>
  );
}
