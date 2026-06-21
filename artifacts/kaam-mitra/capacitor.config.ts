import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for packaging the KaamMitra web app as a native
 * Android app (APK / AAB).
 *
 * webDir must point at the Vite build output. Build the web assets with the
 * `build:mobile` script (which sets BASE_PATH=/ so asset URLs resolve from the
 * app root inside the WebView), then run `pnpm cap:sync`.
 */
const config: CapacitorConfig = {
  appId: "in.kaammitra.app",
  appName: "KaamMitra",
  webDir: "dist/public",
  server: {
    androidScheme: "https",
  },
};

export default config;
