import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoteForm.css";

import { useI18n } from "../../i18n/i18n";
import { getLotById, upsertLot } from "../../lib/storage";

const REGIONS = [
    "Cerrado Mineiro",
    "Sul de Minas",
    "Matas de Minas",
    "Mogiana",
    "Espírito Santo",
    "Bahia",
    "Peru",
    "Colômbia",
    "Outro",
];

const PACKAGING_TYPES = ["Saca 60kg", "Saca 30kg", "Big Bag", "Bulk"];
const SHIP_MONTHS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];
const CURRENCIES = ["USD", "BRL", "EUR"];

function createEmptyLot() {
    return {
        id: crypto.randomUUID(),
        internalCode: "",
        lotName: "",
        region: "",
        originWarehouse: "",
        availableWarehouse: "",
        packaging: {
            type: "Saca 60kg",
            withGP: false,
        },
        offer: {
            salesMode: "sack",
            quantityMin: 20,
            quantityAvailable: 320,
            pricePerSack: "",
            currency: "USD",
            ship: {
                shipMonth: "",
            },
        },
        sca: {
            totalScore: "",
        },
        description: {
            pt: "",
            en: "",
            es: "",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

function isEmpty(value) {
    return String(value ?? "").trim() === "";
}

export default function LoteForm({ mode = "create", lotId }) {
    const { t } = useI18n();
    const navigate = useNavigate();

    const [lot, setLot] = useState(createEmptyLot);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState("");

    useEffect(() => {
        if (mode === "edit" && lotId) {
            const existing = getLotById(lotId);
            if (existing) {
                setLot({
                    ...createEmptyLot(),
                    ...existing,
                    packaging: { ...createEmptyLot().packaging, ...(existing.packaging || {}) },
                    offer: {
                        ...createEmptyLot().offer,
                        ...(existing.offer || {}),
                        ship: {
                            ...createEmptyLot().offer.ship,
                            ...(existing.offer?.ship || {}),
                        },
                    },
                    sca: { ...createEmptyLot().sca, ...(existing.sca || {}) },
                    description: { ...createEmptyLot().description, ...(existing.description || {}) },
                });
            }
        }
    }, [mode, lotId]);

    function setField(path, value) {
        setLot((prev) => {
            const next = structuredClone(prev);
            const parts = path.split(".");
            let current = next;
            for (let i = 0; i < parts.length - 1; i += 1) {
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
            next.updatedAt = new Date().toISOString();
            return next;
        });
    }

    function validate() {
        const nextErrors = {};

        if (isEmpty(lot.internalCode)) nextErrors.internalCode = "Informe o código interno.";
        if (isEmpty(lot.lotName)) nextErrors.lotName = "Informe o nome do lote.";
        if (isEmpty(lot.region)) nextErrors.region = "Selecione a região.";
        if (isEmpty(lot.originWarehouse)) nextErrors.originWarehouse = "Informe o armazém de origem.";
        if (isEmpty(lot.availableWarehouse)) nextErrors.availableWarehouse = "Informe o armazém disponível.";
        if (isEmpty(lot.packaging?.type)) nextErrors.packagingType = "Selecione a embalagem.";
        if (isEmpty(lot.offer?.quantityMin)) nextErrors.quantityMin = "Informe a quantidade mínima.";
        if (isEmpty(lot.offer?.quantityAvailable)) nextErrors.quantityAvailable = "Informe a quantidade disponível.";
        if (isEmpty(lot.offer?.pricePerSack)) nextErrors.pricePerSack = "Informe o preço por saca.";
        if (isEmpty(lot.offer?.ship?.shipMonth)) nextErrors.shipMonth = "Selecione o mês de embarque.";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    function handleSave() {
        if (!validate()) return;

        const payload = {
            ...lot,
            offer: {
                ...lot.offer,
                quantityMin: Number(lot.offer.quantityMin || 0),
                quantityAvailable: Number(lot.offer.quantityAvailable || 0),
                pricePerSack: Number(lot.offer.pricePerSack || 0),
            },
            sca: {
                ...lot.sca,
                totalScore: Number(lot.sca.totalScore || 0),
            },
            updatedAt: new Date().toISOString(),
        };

        upsertLot(payload);
        setToast("Lote salvo com sucesso.");

        setTimeout(() => {
            navigate(`/lotes/${payload.id}`);
        }, 500);
    }

    return (
        <div className="lot-form-page">
            <div className="lot-form-header">
                <div>
                    <h1>{mode === "edit" ? "Editar lote" : "Novo lote"}</h1>
                </div>
                <div className="lot-form-actions">
                    <button type="button" className="btn secondary" onClick={() => navigate("/lotes")}>
                        Cancelar
                    </button>
                    <button type="button" className="btn" onClick={handleSave}>
                        {t("save") || "Salvar"}
                    </button>
                </div>
            </div>

            {toast ? <div className="toast">{toast}</div> : null}

            <div className="card">
                <h2>Informações básicas</h2>
                <div className="grid-2">
                    <div className="field">
                        <label>Código interno</label>
                        <input value={lot.internalCode} onChange={(e) => setField("internalCode", e.target.value)} />
                        {errors.internalCode ? <span className="error">{errors.internalCode}</span> : null}
                    </div>

                    <div className="field">
                        <label>Nome do lote</label>
                        <input value={lot.lotName} onChange={(e) => setField("lotName", e.target.value)} />
                        {errors.lotName ? <span className="error">{errors.lotName}</span> : null}
                    </div>

                    <div className="field">
                        <label>Região / origem</label>
                        <select value={lot.region} onChange={(e) => setField("region", e.target.value)}>
                            <option value="">Selecione</option>
                            {REGIONS.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        {errors.region ? <span className="error">{errors.region}</span> : null}
                    </div>

                    <div className="field">
                        <label>Nota SCA</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={lot.sca.totalScore}
                            onChange={(e) => setField("sca.totalScore", e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label>Armazém de origem</label>
                        <input value={lot.originWarehouse} onChange={(e) => setField("originWarehouse", e.target.value)} />
                        {errors.originWarehouse ? <span className="error">{errors.originWarehouse}</span> : null}
                    </div>

                    <div className="field">
                        <label>Armazém disponível</label>
                        <input value={lot.availableWarehouse} onChange={(e) => setField("availableWarehouse", e.target.value)} />
                        {errors.availableWarehouse ? <span className="error">{errors.availableWarehouse}</span> : null}
                    </div>
                </div>
            </div>

            <div className="card">
                <h2>Oferta comercial</h2>
                <div className="grid-2">
                    <div className="field">
                        <label>Modo de venda</label>
                        <select value={lot.offer.salesMode} onChange={(e) => setField("offer.salesMode", e.target.value)}>
                            <option value="sack">Por saca</option>
                            <option value="container">Contêiner</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>Embalagem</label>
                        <select value={lot.packaging.type} onChange={(e) => setField("packaging.type", e.target.value)}>
                            {PACKAGING_TYPES.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        {errors.packagingType ? <span className="error">{errors.packagingType}</span> : null}
                    </div>

                    <div className="field">
                        <label>Moeda</label>
                        <select value={lot.offer.currency} onChange={(e) => setField("offer.currency", e.target.value)}>
                            {CURRENCIES.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Quantidade mínima</label>
                        <input
                            type="number"
                            min="1"
                            value={lot.offer.quantityMin}
                            onChange={(e) => setField("offer.quantityMin", e.target.value)}
                        />
                        {errors.quantityMin ? <span className="error">{errors.quantityMin}</span> : null}
                    </div>

                    <div className="field">
                        <label>Quantidade disponível</label>
                        <input
                            type="number"
                            min="1"
                            value={lot.offer.quantityAvailable}
                            onChange={(e) => setField("offer.quantityAvailable", e.target.value)}
                        />
                        {errors.quantityAvailable ? <span className="error">{errors.quantityAvailable}</span> : null}
                    </div>

                    <div className="field">
                        <label>Preço por saca</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={lot.offer.pricePerSack}
                            onChange={(e) => setField("offer.pricePerSack", e.target.value)}
                        />
                        {errors.pricePerSack ? <span className="error">{errors.pricePerSack}</span> : null}
                    </div>

                    <div className="field">
                        <label>Mês de embarque</label>
                        <select value={lot.offer.ship.shipMonth} onChange={(e) => setField("offer.ship.shipMonth", e.target.value)}>
                            <option value="">Selecione</option>
                            {SHIP_MONTHS.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        {errors.shipMonth ? <span className="error">{errors.shipMonth}</span> : null}
                    </div>
                </div>
            </div>

            <div className="card">
                <h2>Descrição</h2>
                <div className="grid-1">
                    <div className="field">
                        <label>Descrição em português</label>
                        <textarea
                            rows="5"
                            value={lot.description.pt}
                            onChange={(e) => setField("description.pt", e.target.value)}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
