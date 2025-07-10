import { cssInterop } from 'nativewind';

export function withClassName(slot: any) {
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
