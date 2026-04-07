import type { CollectionListResponse } from "@/types/collection";
import type { PlanListResponse } from "@/types/plan";
import type { UserMeResponse } from "@/types/user";

const sampleCardImage = "/illust/place-empty_new.svg";
const sampleProfileImage = "/icons/google.svg";

export const localDevMockMe: UserMeResponse = {
  user_id: "local-dev-user",
  nickname: "트립픽셀 개발용 계정",
  email: "local-dev@trippixel.test",
  picture: sampleProfileImage,
  provider: "GOOGLE",
};

export const createLocalDevCollections = (size: number): CollectionListResponse => ({
  contents: [
    {
      collection_id: "local-collection-1",
      title: "성수 카페 보관함",
      thumbnail: sampleCardImage,
      member_count: 3,
      place_count: 12,
    },
    {
      collection_id: "local-collection-2",
      title: "부산 야경 후보 모음",
      thumbnail: sampleCardImage,
      member_count: 5,
      place_count: 8,
    },
  ],
  has_next: false,
  page: 0,
  size,
});

export const createLocalDevPlans = (size: number): PlanListResponse => ({
  contents: [
    {
      plan_id: "local-plan-1",
      title: "제주 2박 3일 먹방 여행",
      thumbnail: sampleCardImage,
      start_date: "2026-04-20",
      end_date: "2026-04-24",
      duration_days: 5,
      member_count: 4,
      collection_count: 2,
    },
    {
      plan_id: "local-plan-2",
      title: "강릉 당일치기 드라이브",
      thumbnail: sampleCardImage,
      start_date: "2026-05-02",
      end_date: "2026-05-04",
      duration_days: 3,
      member_count: 2,
      collection_count: 1,
    },
  ],
  has_next: false,
  page: 0,
  size,
});
