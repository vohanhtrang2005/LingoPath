import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2Icon, LoaderCircleIcon, PlusIcon, XCircleIcon } from "lucide-react";
import { contentApi } from "../../../api/contentApi";
import {
  CEFR_LEVELS,
  JLPT_LEVELS,
  type BookLanguage,
  type BookLevelSystem,
  type BookStatus
} from "../../../types/content";

interface CreateBookFormProps {
  onCreated: () => void;
}

interface FormState {
  name: string;
  author: string;
  language: BookLanguage | "";
  levelSystem: BookLevelSystem | "";
  levelCode: string;
  status: BookStatus;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  name: "",
  author: "",
  language: "",
  levelSystem: "",
  levelCode: "",
  status: "ACTIVE"
};

const FIELD_CLASS =
  "gk-well w-full rounded-4xl bg-cream-100/90 px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint";
const SELECT_CLASS = `${FIELD_CLASS} appearance-none`;

export function CreateBookForm({ onCreated }: CreateBookFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );

  const levelCodes =
    form.levelSystem === "JLPT" ? JLPT_LEVELS : form.levelSystem === "CEFR" ? CEFR_LEVELS : [];

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      if (key === "levelSystem") {
        return { ...prev, levelSystem: value as BookLevelSystem, levelCode: "" };
      }
      return { ...prev, [key]: value };
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setMessage(null);
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (form.name.trim() === "") next.name = "Name is required.";
    if (!form.language) next.language = "Language is required.";
    if (!form.levelSystem) next.levelSystem = "Level system is required.";
    if (!form.levelCode) next.levelCode = "Level code is required.";
    return next;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setMessage(null);
    try {
      await contentApi.createBook({
        name: form.name.trim(),
        author: form.author.trim() === "" ? undefined : form.author.trim(),
        language: form.language as BookLanguage,
        levelSystem: form.levelSystem as BookLevelSystem,
        levelCode: form.levelCode,
        status: form.status
      });
      setMessage({ tone: "success", text: "Book created." });
      setForm((prev) => ({ ...prev, name: "", author: "" }));
      onCreated();
    } catch {
      setMessage({ tone: "error", text: "Could not create book." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="create-book-title"
      className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6"
    >
      <h2 id="create-book-title" className="font-display text-sm font-bold text-ink">
        Create a book
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
        Register the learning source first. Documents are uploaded from the book detail page.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="book-name" className="mb-1.5 block font-display text-xs font-bold text-ink-soft">
            Name <span className="text-peach-600">*</span>
          </label>
          <input
            id="book-name"
            type="text"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            placeholder="Minna no Nihongo I"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "book-name-error" : undefined}
            className={FIELD_CLASS}
          />
          {errors.name ? (
            <p id="book-name-error" className="mt-1.5 pl-2 text-xs font-bold text-[#c65f5f]">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="book-author" className="mb-1.5 block font-display text-xs font-bold text-ink-soft">
            Author
          </label>
          <input
            id="book-author"
            type="text"
            value={form.author}
            onChange={(event) => setField("author", event.target.value)}
            placeholder="Optional"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label
            htmlFor="book-language"
            className="mb-1.5 block font-display text-xs font-bold text-ink-soft"
          >
            Language <span className="text-peach-600">*</span>
          </label>
          <select
            id="book-language"
            value={form.language}
            onChange={(event) => setField("language", event.target.value as BookLanguage)}
            aria-invalid={Boolean(errors.language)}
            aria-describedby={errors.language ? "book-language-error" : undefined}
            className={SELECT_CLASS}
          >
            <option value="">Select a language</option>
            <option value="JAPANESE">JAPANESE</option>
            <option value="ENGLISH">ENGLISH</option>
          </select>
          {errors.language ? (
            <p id="book-language-error" className="mt-1.5 pl-2 text-xs font-bold text-[#c65f5f]">
              {errors.language}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="book-level-system"
            className="mb-1.5 block font-display text-xs font-bold text-ink-soft"
          >
            Level system <span className="text-peach-600">*</span>
          </label>
          <select
            id="book-level-system"
            value={form.levelSystem}
            onChange={(event) => setField("levelSystem", event.target.value as BookLevelSystem)}
            aria-invalid={Boolean(errors.levelSystem)}
            aria-describedby={errors.levelSystem ? "book-level-system-error" : undefined}
            className={SELECT_CLASS}
          >
            <option value="">Select a system</option>
            <option value="JLPT">JLPT</option>
            <option value="CEFR">CEFR</option>
          </select>
          {errors.levelSystem ? (
            <p
              id="book-level-system-error"
              className="mt-1.5 pl-2 text-xs font-bold text-[#c65f5f]"
            >
              {errors.levelSystem}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="book-level-code"
            className="mb-1.5 block font-display text-xs font-bold text-ink-soft"
          >
            Level code <span className="text-peach-600">*</span>
          </label>
          <select
            id="book-level-code"
            value={form.levelCode}
            onChange={(event) => setField("levelCode", event.target.value)}
            disabled={!form.levelSystem}
            aria-invalid={Boolean(errors.levelCode)}
            aria-describedby={errors.levelCode ? "book-level-code-error" : undefined}
            className={`${SELECT_CLASS} ${!form.levelSystem ? "text-ink-faint" : ""}`}
          >
            <option value="">
              {form.levelSystem ? "Select a level" : "Choose a level system first"}
            </option>
            {levelCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          {errors.levelCode ? (
            <p id="book-level-code-error" className="mt-1.5 pl-2 text-xs font-bold text-[#c65f5f]">
              {errors.levelCode}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="book-status" className="mb-1.5 block font-display text-xs font-bold text-ink-soft">
            Status
          </label>
          <select
            id="book-status"
            value={form.status}
            onChange={(event) => setField("status", event.target.value as BookStatus)}
            className={SELECT_CLASS}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-display text-sm font-bold text-white transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
            submitting ? "cursor-default bg-peach-200" : "bg-peach-500 hover:bg-peach-400"
          }`}
        >
          {submitting ? (
            <>
              <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
              Creating...
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              Create book
            </>
          )}
        </button>

        {message ? (
          <p
            role="status"
            className={`flex items-center gap-2 rounded-[1.25rem] px-4 py-3 text-sm font-bold ${
              message.tone === "success" ? "bg-mint-100 text-[#2f6a4f]" : "bg-peach-100 text-[#b9524f]"
            }`}
          >
            {message.tone === "success" ? (
              <CheckCircle2Icon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <XCircleIcon className="h-4 w-4" aria-hidden="true" />
            )}
            {message.text}
          </p>
        ) : null}
      </form>
    </section>
  );
}
