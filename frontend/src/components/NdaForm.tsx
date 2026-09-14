"use client";

import type { FieldError, FieldErrors, UseFormReturn } from "react-hook-form";
import type { NdaData } from "@/lib/nda/schema";

interface NdaFormProps {
  form: UseFormReturn<NdaData>;
}

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm " +
  "placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 " +
  "aria-[invalid=true]:border-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

const legendClass = "mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100";

/** Links an input to its error message for screen readers. */
function a11y(errors: FieldErrors<NdaData>, name: keyof NdaData) {
  return {
    id: name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  };
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: FieldError;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error.message}
        </p>
      ) : hint ? (
        <p className="text-xs text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}

type PartyPrefix = "party1" | "party2";

interface PartyFieldsetProps {
  form: UseFormReturn<NdaData>;
  prefix: PartyPrefix;
  legend: string;
  namePlaceholder: string;
  addressPlaceholder: string;
}

/** Legal name + address for one party; rendered once per side of the agreement. */
function PartyFieldset({ form, prefix, legend, namePlaceholder, addressPlaceholder }: PartyFieldsetProps) {
  const { register, formState: { errors } } = form;
  const nameField = `${prefix}Name` as const;
  const addressField = `${prefix}Address` as const;

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className={legendClass}>{legend}</legend>
      <Field id={nameField} label="Legal name" error={errors[nameField]}>
        <input
          {...register(nameField)}
          {...a11y(errors, nameField)}
          className={inputClass}
          placeholder={namePlaceholder}
          autoComplete="organization"
        />
      </Field>
      <Field id={addressField} label="Address" error={errors[addressField]}>
        <textarea
          {...register(addressField)}
          {...a11y(errors, addressField)}
          className={inputClass}
          rows={2}
          placeholder={addressPlaceholder}
        />
      </Field>
    </fieldset>
  );
}

/** The data-entry side of the creator. Owns no state; the parent supplies the form instance. */
export function NdaForm({ form }: NdaFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={(e) => e.preventDefault()}>
      <PartyFieldset
        form={form}
        prefix="party1"
        legend="Party 1"
        namePlaceholder="Acme Corporation"
        addressPlaceholder="123 Main Street, Springfield, IL 62701"
      />
      <PartyFieldset
        form={form}
        prefix="party2"
        legend="Party 2"
        namePlaceholder="Globex Inc."
        addressPlaceholder="456 Elm Street, Shelbyville, IL 62565"
      />

      <fieldset className="flex flex-col gap-4">
        <legend className={legendClass}>Agreement terms</legend>
        <Field id="effectiveDate" label="Effective date" error={errors.effectiveDate}>
          <input
            type="date"
            {...register("effectiveDate")}
            {...a11y(errors, "effectiveDate")}
            className={inputClass}
          />
        </Field>
        <Field
          id="purpose"
          label="Purpose of disclosure"
          error={errors.purpose}
          hint='Completes the sentence "The Parties wish to explore …"'
        >
          <textarea
            {...register("purpose")}
            {...a11y(errors, "purpose")}
            className={inputClass}
            rows={2}
            placeholder="a potential business partnership"
          />
        </Field>
        <Field id="termYears" label="Term (years)" error={errors.termYears}>
          <input
            type="number"
            min={1}
            max={10}
            step={1}
            {...register("termYears", { valueAsNumber: true })}
            {...a11y(errors, "termYears")}
            className={inputClass}
          />
        </Field>
        <Field
          id="governingLaw"
          label="Governing law"
          error={errors.governingLaw}
          hint="The jurisdiction whose laws govern the agreement"
        >
          <input
            {...register("governingLaw")}
            {...a11y(errors, "governingLaw")}
            className={inputClass}
            placeholder="the State of Delaware, USA"
          />
        </Field>
      </fieldset>
    </form>
  );
}
