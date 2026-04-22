// src/components/auth/PrivacyConsent.tsx
//consent checkbox

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
};

export default function PrivacyConsent({ checked, onChange }: Props) {
  return (
    <label className="flex items-start gap-3 text-sm text-neutral-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-900"
      />
      <span>
        I accept Ultra’s <a href="/privacy" className="text-ultraGold underline">Privacy Policy</a> and the collection of
        limited health/allergy information for safety screening. I understand samples are for sniffing only.
      </span>
    </label>
  );
}
