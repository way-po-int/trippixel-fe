import MypageClient from "./mypage-client";
import { env } from "@/lib/utils/env";

// Server component - validates environment variables
const Mypage = () => {
  // Server-side environment variable validation
  const vocUrl = env.urls.voc;
  const guidUrl = env.urls.guide;

  return <MypageClient guidUrl={guidUrl} vocUrl={vocUrl} />;
};

export default Mypage;
