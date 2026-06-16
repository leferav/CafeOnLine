import { useEffect, useRef, useState } from "react";
import { useI18n, LANG_LABELS, LANG_OPTIONS } from "../../i18n/i18n";
import "./LanguageMenu.css";

export default function LanguageMenu({ variant = "navbar" }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selecionarIdioma(code) {
    setLang(code);
    setOpen(false);
  }

  if (variant === "drawer") {
    return (
      <div className="lang-menu lang-menu--drawer">
        <span className="lang-menu-drawer-label">{t("language")}</span>
        <div className="lang-menu-drawer-options">
          {LANG_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              className={`lang-menu-drawer-btn ${lang === option.code ? "active" : ""}`}
              onClick={() => selecionarIdioma(option.code)}
            >
              <span>{LANG_LABELS[option.code]}</span>
              <span>{t(option.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`lang-menu lang-menu--${variant}`} ref={rootRef}>
      <button
        type="button"
        className="lang-menu-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("language")}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {LANG_LABELS[lang]}
        <span className={`lang-menu-caret ${open ? "open" : ""}`}>⌄</span>
      </button>

      {open && (
        <ul className="lang-menu-dropdown" role="listbox" aria-label={t("language")}>
          {LANG_OPTIONS.map((option) => (
            <li key={option.code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={lang === option.code}
                className={`lang-menu-option ${lang === option.code ? "active" : ""}`}
                onClick={() => selecionarIdioma(option.code)}
              >
                <span className="lang-menu-option-code">{LANG_LABELS[option.code]}</span>
                <span className="lang-menu-option-label">{t(option.labelKey)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
