import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function cookieConsentGiven(): "accept" | "reject" | "undecided" {
  if (!localStorage.getItem("cookieConsentGiven")) {
    return "undecided";
  }
  return localStorage.getItem("cookieConsentGiven") === "true"
    ? "accept"
    : "reject";
}

export function Cookies() {
  const [cookieConsent, setCookieConsent] = useState(() =>
    cookieConsentGiven(),
  );

  useEffect(() => {
    if (cookieConsent !== "undecided") {
      posthog.set_config({
        persistence:
          cookieConsent === "accept" ? "localStorage+cookie" : "memory",
      });
    }
  }, [cookieConsent]);

  const [toastID, setToastID] = useState<string | number | null>(null);

  useEffect(() => {
    if (cookieConsent === "undecided" && !toastID) {
      const id = toast.info(
        "We use cookies to improve your experience. By continuing, you agree to our use of cookies.",
        {
          action: {
            label: "Accept",
            onClick: () => {
              setCookieConsent("accept");
              localStorage.setItem("cookieConsentGiven", "true");
            },
          },
          cancel: {
            label: "Decline",
            onClick: () => {
              setCookieConsent("reject");
              localStorage.setItem("cookieConsentGiven", "false");
            },
          },
          duration: Number.POSITIVE_INFINITY,
        },
      );
      setToastID(id);
    }
  }, [cookieConsent, toastID]);

  return null;
}
