import { useCallback } from 'react';
import { useDB } from './use-db';
import { translate, type TKey } from '@/i18n/translations';

export function useT() {
  const { settings } = useDB();
  const lang = settings?.language || 'en-IN';
  const t = useCallback(
    (key: TKey | string) => translate(lang, key),
    [lang],
  );
  return { t, lang };
}
