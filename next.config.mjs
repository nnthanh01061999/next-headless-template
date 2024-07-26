import createNextIntlPlugin from "next-intl/plugin";
import createPWA from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin();

const withPWA = createPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withNextIntl(
  withPWA({
    // Your Next.js config
  }),
);
