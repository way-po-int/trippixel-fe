import OnboardClient from "./onboard-client";
import { env } from "@/lib/utils/env";

// Server component - validates environment variables
const OnboardPage = () => {
  // Server-side environment variable validation
  const serviceTermsUrl = env.urls.serviceTerms;
  const privacyPolicyUrl = env.urls.privacyPolicy;

  return (
    <OnboardClient
      serviceTermsUrl={serviceTermsUrl}
      privacyPolicyUrl={privacyPolicyUrl}
    />
  );
};

export default OnboardPage;
