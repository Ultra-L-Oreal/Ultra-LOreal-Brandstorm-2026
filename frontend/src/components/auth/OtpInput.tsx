// src/components/auth/OtpInput.tsx
// 6-digit OTP UI (reusable)
import React, { useEffect, useRef } from 'react';

type Props = {
  value: string[];
  setValue: (arr: string[]) => void;
  disabled?: boolean;
  inputMode?: 'numeric' | 'text';
};

export default function OtpInput({ value, setValue, disabled = false, inputMode = 'numeric' }: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // useEffect(() => {
  //   // focus first empty
  //   const first = value.findIndex((v) => !v);
  //   const idx = first === -1 ? value.length - 1 : first;
  //   inputsRef.current[idx]?.focus();
  // }, []);
  useEffect(() => {
    const first = value.findIndex((v) => !v);
    const idx = first === -1 ? value.length - 1 : first;
    inputsRef.current[idx]?.focus();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setDigit(i: number, v: string) {
    const next = [...value];
    next[i] = v.slice(0, 1);
    setValue(next);
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    const k = e.key;
    if (k === 'Backspace') {
      e.preventDefault();
      if (value[i]) {
        setDigit(i, '');
      } else if (i > 0) {
        setDigit(i - 1, '');
        inputsRef.current[i - 1]?.focus();
      }
    } else if (k === 'ArrowLeft') {
      e.preventDefault();
      inputsRef.current[Math.max(0, i - 1)]?.focus();
    } else if (k === 'ArrowRight') {
      e.preventDefault();
      inputsRef.current[Math.min(5, i + 1)]?.focus();
    } else if (k === 'Enter') {
      // handled by parent form
    } else if (/^[0-9]$/.test(k) && inputMode === 'numeric') {
      e.preventDefault();
      setDigit(i, k);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    const arr = text.split('').concat(Array(6).fill('')).slice(0, 6);
    setValue(arr);
  }

  return (
    <div onPaste={handlePaste} className="flex gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          // ref={(el) => (inputsRef.current[i] = el)}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          className="w-12 h-12 md:w-14 md:h-14 text-center rounded-md bg-neutral-900 border border-neutral-700 focus:border-ultraGold outline-none text-xl"
          value={value[i]}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => onKeyDown(e, i)}
          inputMode={inputMode}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
