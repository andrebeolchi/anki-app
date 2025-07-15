import { cssInterop } from 'nativewind';

export function withClassName(slot: any | any[]) {
  if (!slot) {
    return;
  }

  if (Array.isArray(slot)) {
    slot.forEach(withClassName);
    return;
  }

  cssInterop(slot, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}
