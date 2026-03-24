"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import HeaderBtn from "@/components/layout/HeaderBtn";
import NavigationBar from "@/components/layout/NavigationBar";
import VoteBtn from "@/components/common/VoteBtn";
import ProfileImage from "@/components/common/ProfileImage";
import AISummarySection from "@/components/common/AISummarySection";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import GoogleMap from "@/components/common/GoogleMap";
import { MapPin, Sparkles, SquareArrowOutUpRight } from "lucide-react";
import { useParams } from "next/navigation";
import {
  usePlaceDetail,
  useUpdatePlaceMemo,
  useUpdatePlacePreference,
} from "@/lib/hooks/use-place-detail";

type VoteMemberSheetType = "PICK" | "PASS";
const MEMO_MAX_LENGTH = 300;

const PlaceDetailPage = () => {
  const params = useParams<{ id: string | string[]; placeId: string | string[] }>();
  const collectionId = Array.isArray(params.id) ? params.id[0] : params.id;
  const collectionPlaceId = Array.isArray(params.placeId) ? params.placeId[0] : params.placeId;

  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memo, setMemo] = useState("");
  const [isVoteMemberSheetOpen, setIsVoteMemberSheetOpen] = useState(false);
  const [voteMemberSheetType, setVoteMemberSheetType] = useState<VoteMemberSheetType>("PICK");

  const {
    data: placeDetail,
    isLoading,
    isError,
  } = usePlaceDetail({
    collectionId,
    collectionPlaceId,
    enabled: Boolean(collectionId && collectionPlaceId),
  });
  const updatePlaceMemoMutation = useUpdatePlaceMemo({
    collectionId,
    collectionPlaceId,
  });
  const updatePlacePreferenceMutation = useUpdatePlacePreference({
    collectionId,
    collectionPlaceId,
  });

  const placeName = placeDetail?.name ?? "";
  const category = placeDetail?.category ?? "";
  const address = placeDetail?.address ?? "";
  const aiSummary = placeDetail?.aiSummary ?? "";
  const sourceTitle = placeDetail?.sourceTitle ?? "";
  const sourceUrl = placeDetail?.sourceUrl;
  const externalUrl = placeDetail?.externalUrl;
  const pickCount = placeDetail?.pickCount ?? 0;
  const passCount = placeDetail?.passCount ?? 0;
  const latitude = placeDetail?.latitude;
  const longitude = placeDetail?.longitude;
  const coverImageUrl = placeDetail?.photoUrls?.[0];
  const pickedMembers = placeDetail?.pickedMembers ?? [];
  const passedMembers = placeDetail?.passedMembers ?? [];
  const originalMemo = placeDetail?.memo ?? "";
  const myPreference = placeDetail?.myPreference ?? null;
  const isPickActive = myPreference === "PICK";
  const isPassActive = myPreference === "PASS";

  const openInNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEditMemo = () => {
    setMemo(originalMemo);
    setIsEditingMemo(true);
  };

  const handleSaveMemo = () => {
    if (!collectionId || !collectionPlaceId) return;
    const nextMemo = memo.slice(0, MEMO_MAX_LENGTH);
    if (nextMemo === originalMemo) {
      setIsEditingMemo(false);
      return;
    }

    updatePlaceMemoMutation.mutate(
      { memo: nextMemo },
      {
        onSuccess: () => {
          setIsEditingMemo(false);
        },
      },
    );
  };

  const handleVoteToggle = (type: "PICK" | "PASS") => {
    if (!collectionId || !collectionPlaceId || updatePlacePreferenceMutation.isPending) return;

    updatePlacePreferenceMutation.mutate({ type });
  };

  const handleVoteCountClick = (type: "PICK" | "PASS") => {
    setVoteMemberSheetType(type);
    setIsVoteMemberSheetOpen(true);
  };

  const voteMembers = voteMemberSheetType === "PICK" ? pickedMembers : passedMembers;
  const voteMemberSheetTitle =
    voteMemberSheetType === "PICK" ? "좋아요를 누른 멤버" : "다음에요를 누른 멤버";
  const voteMemberItems =
    voteMembers.length > 0
      ? voteMembers.map((member) => ({
          id: member.collection_member_id,
          label: member.nickname ?? "이름 미상",
          icon: (
            <ProfileImage size="sm" src={member.picture ?? ""} alt={member.nickname ?? "멤버"} />
          ),
          disabled: true,
        }))
      : [
          {
            id: "empty",
            label: "아직 참여한 멤버가 없어요",
            disabled: true,
          },
        ];

  return (
    <div className="relative min-h-screen min-w-0 overflow-x-hidden pb-[calc(72px+env(safe-area-inset-bottom)+16px)]">
      <Header showBackButton leftBtnBgVariant="glass" className="fixed inset-x-0 top-0 z-50" />
      {/* 이미지 영역 */}
      <div className="bg-muted fixed top-0 right-0 left-0 z-0 aspect-5/3 w-full">
        {coverImageUrl && (
          <Image src={coverImageUrl} alt={placeName} fill className="object-cover" priority />
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative pt-[calc(60%-17px)]">
        <div className="bg-background flex min-w-0 flex-col gap-16 rounded-t-2xl px-5 pt-7">
          <div className="flex w-full min-w-0 flex-col">
            <h2 className="flex h-8 w-full items-center justify-between px-1 py-0.5">
              <span className="typography-title-lg-sb text-foreground">{placeName}</span>
              <span className="typography-body-sm-bold text-muted-foreground">{category}</span>
            </h2>
            <div className="flex w-full flex-1 flex-col gap-5 pt-4">
              {/* 주소 영역 */}
              <div className="flex w-full flex-col gap-1">
                <hr className="border-border" />
                <div className="flex h-11 w-full items-center justify-between">
                  <div className="flex items-center gap-2.25">
                    <MapPin className="text-muted-foreground size-6" />
                    <span className="typography-body-sm-md text-foreground">{address}</span>
                  </div>
                  <HeaderBtn
                    bgVariant="ghost"
                    icon={SquareArrowOutUpRight}
                    label="외부 링크"
                    onClick={externalUrl ? () => openInNewTab(externalUrl) : undefined}
                  />
                </div>
                <hr className="border-border" />
              </div>
              {/* 투표 버튼 영역 */}
              <div className="flex w-full gap-3 pb-3.5">
                <VoteBtn
                  type="pick"
                  count={pickCount}
                  isActive={isPickActive}
                  onToggle={() => handleVoteToggle("PICK")}
                  onCountClick={() => handleVoteCountClick("PICK")}
                />
                <VoteBtn
                  type="pass"
                  count={passCount}
                  isActive={isPassActive}
                  onToggle={() => handleVoteToggle("PASS")}
                  onCountClick={() => handleVoteCountClick("PASS")}
                />
              </div>
              {/* 메모 영역 */}
              <div className="flex w-full flex-col gap-2">
                <Label isEditing={isEditingMemo} onEdit={handleEditMemo} onSave={handleSaveMemo}>
                  메모
                </Label>
                <Textarea
                  placeholder="텍스트를 입력해주세요."
                  value={isEditingMemo ? memo : (placeDetail?.memo ?? "")}
                  onChange={(e) => setMemo(e.target.value.slice(0, MEMO_MAX_LENGTH))}
                  maxLength={MEMO_MAX_LENGTH}
                  disabled={!isEditingMemo || updatePlaceMemoMutation.isPending}
                />
              </div>
              {/* 지도 영역 */}
              <div className="h-57 w-full overflow-hidden rounded-xl">
                {latitude !== undefined && longitude !== undefined ? (
                  <GoogleMap
                    center={{ lat: latitude, lng: longitude }}
                    zoom={15}
                    markerPosition={{ lat: latitude, lng: longitude }}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="bg-muted typography-body-sm-reg text-muted-foreground flex h-full w-full items-center justify-center">
                    지도를 불러오는 중...
                  </div>
                )}
              </div>
              <AISummarySection
                isLoading={isLoading}
                headerIcon={<Sparkles className="text-foreground size-6" />}
                title="AI 요약"
                summary={aiSummary}
                sourceTitle={sourceTitle}
                sourceUrl={sourceUrl}
                onOpenLink={openInNewTab}
              />
            </div>
            {isError && (
              <p className="typography-caption-xs-reg text-destructive px-1">
                장소 정보를 불러오지 못했습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      <NavigationBar className="fixed right-0 bottom-0 left-0 z-50" />
      <BottomSheet
        open={isVoteMemberSheetOpen}
        onOpenChange={setIsVoteMemberSheetOpen}
        title={voteMemberSheetTitle}
        showTitle
        itemVariant="member"
        cancelLabel="닫기"
        showCloseIcon
        items={voteMemberItems}
      />
    </div>
  );
};

export default PlaceDetailPage;
