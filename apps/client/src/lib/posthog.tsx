import { useEffect } from "react";
import posthog from "posthog-js";

export function PosthogInit() {
  useEffect(() => {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: `${import.meta.env.VITE_SERVER_URL}/collect`,
    });
    posthog.capture("event", { event: "pageview" });
  }, []);

  return null;
}
