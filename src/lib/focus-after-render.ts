import { TextInput } from 'react-native';

/**
 * Aguarda um pequeno tempo e foca no TextInput quando estiver disponível.
 * @param ref - A ref do TextInput ou TextArea
 * @param delay - Tempo em ms (padrão: 100ms)
 */
export function focusAfterRender(ref: TextInput | null | undefined, delay = 100) {
  if (!ref?.focus) return;

  setTimeout(() => {
    ref.focus?.();
  }, delay);
}
