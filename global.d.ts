import vi from './messages/vi.json';

type Messages = typeof vi;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
  interface Window {
    fbq: any;
  }
}
