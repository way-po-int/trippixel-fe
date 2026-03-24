"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import HeaderBtn from "@/components/layout/HeaderBtn";
import NavigationBar from "@/components/layout/NavigationBar";
import AISummarySection from "@/components/common/AISummarySection";
import AppAlertDialog from "@/components/common/AppAlertDialog";
import OpinionBottomSheet from "@/components/common/OpinionBottomSheet";
import OpinionCard from "@/components/common/OpinionCard";
import OpinionProfile from "@/components/common/OpinionProfile";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GoogleMap from "@/components/common/GoogleMap";
import { Calendar, MapPin, MessageCircle, Sparkles, SquareArrowOutUpRight } from "lucide-react";
import { useParams } from "next/navigation";
import type { BlockOpinion, OpinionCategoryKey, OpinionState } from "@/lib/opinion-bottom-sheet";
import {
  useCreateBlockOpinion,
  useDeleteBlockOpinion,
  useUpdateBlockOpinion,
} from "@/lib/hooks/use-block-opinion";
import { useBlockDetail, useUpdateBlock } from "@/lib/hooks/use-block-detail";

const MEMO_MAX_LENGTH = 300;
const CUSTOM_INPUT_REASON_ID = 0;
const EMPTY_REASON_IDS_BY_STATE: Record<OpinionState, number[]> = {
  POSITIVE: [],
  NEUTRAL: [],
  NEGATIVE: [],
};
const EMPTY_CUSTOM_TEXT_BY_STATE: Record<OpinionState, string> = {
  POSITIVE: "",
  NEUTRAL: "",
  NEGATIVE: "",
};

const resolveOpinionCategoryKey = (category: string): OpinionCategoryKey => {
  if (category.includes("식당") || category.includes("주점")) return "FNB";
  if (category.includes("카페") || category.includes("디저트")) return "DESSERT";
  if (category.includes("숙소")) return "STAY";
  if (category.includes("쇼핑")) return "SHOPPING";
  if (
    category.includes("관광") ||
    category.includes("문화") ||
    category.includes("공원") ||
    category.includes("자연")
  ) {
    return "TOUR";
  }

  return "GENERAL";
};

const BlockDetailPage = () => {
  const params = useParams<{ planId: string | string[]; timeBlockId: string | string[] }>();
  const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
  const blockId = Array.isArray(params.timeBlockId) ? params.timeBlockId[0] : params.timeBlockId;

  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoDraft, setMemoDraft] = useState("");
  const [editingOpinion, setEditingOpinion] = useState<BlockOpinion | null>(null);
  const [deletingOpinion, setDeletingOpinion] = useState<BlockOpinion | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editCurrentState, setEditCurrentState] = useState<OpinionState>("POSITIVE");
  const [editReasonIdsByState, setEditReasonIdsByState] =
    useState<Record<OpinionState, number[]>>(EMPTY_REASON_IDS_BY_STATE);
  const [editCustomTextByState, setEditCustomTextByState] = useState<Record<OpinionState, string>>(
    EMPTY_CUSTOM_TEXT_BY_STATE,
  );
  const [isAddingOpinion, setIsAddingOpinion] = useState(false);
  const [addCurrentState, setAddCurrentState] = useState<OpinionState>("POSITIVE");
  const [addReasonIdsByState, setAddReasonIdsByState] =
    useState<Record<OpinionState, number[]>>(EMPTY_REASON_IDS_BY_STATE);
  const [addCustomTextByState, setAddCustomTextByState] = useState<Record<OpinionState, string>>(
    EMPTY_CUSTOM_TEXT_BY_STATE,
  );

  const {
    data: blockDetail,
    isLoading,
    isError,
  } = useBlockDetail({
    planId,
    blockId,
    enabled: Boolean(planId && blockId),
  });
  const updateBlockMutation = useUpdateBlock({ planId, blockId });
  const createBlockOpinionMutation = useCreateBlockOpinion({ planId, blockId });
  const updateBlockOpinionMutation = useUpdateBlockOpinion({ planId, blockId });
  const deleteBlockOpinionMutation = useDeleteBlockOpinion({ planId, blockId });

  const placeName = blockDetail?.placeName ?? "";
  const category = blockDetail?.category ?? "";
  const address = blockDetail?.address ?? "";
  const aiSummary = blockDetail?.aiSummary ?? "";
  const sourceTitle = blockDetail?.sourceTitle ?? "";
  const sourceUrl = blockDetail?.sourceUrl;
  const externalUrl = blockDetail?.googleMapsUri;
  const latitude = blockDetail?.latitude;
  const longitude = blockDetail?.longitude;
  const coverImageUrl = blockDetail?.photoUrls?.[0];
  const memo = blockDetail?.memo ?? "";
  const myOpinionId = blockDetail?.myOpinionId;
  const opinions = blockDetail?.opinions ?? [];
  const opinionCategoryKey = resolveOpinionCategoryKey(category);
  const editCurrentReasonIds = editReasonIdsByState[editCurrentState] ?? [];
  const editCurrentCustomText = editCustomTextByState[editCurrentState] ?? "";
  const editEffectiveCustomText = editCurrentReasonIds.includes(CUSTOM_INPUT_REASON_ID)
    ? editCurrentCustomText
    : "";
  const addCurrentReasonIds = addReasonIdsByState[addCurrentState] ?? [];
  const addCurrentCustomText = addCustomTextByState[addCurrentState] ?? "";
  const hasChanged = editingOpinion
    ? editCurrentState !== editingOpinion.type ||
      editEffectiveCustomText !== (editingOpinion.comment ?? "") ||
      JSON.stringify(
        [...editCurrentReasonIds.filter((id) => id !== CUSTOM_INPUT_REASON_ID)].sort(
          (a, b) => a - b,
        ),
      ) !== JSON.stringify([...editingOpinion.tag_ids.map(Number)].sort((a, b) => a - b))
    : false;
  const dayText = `${blockDetail?.day ?? 0}일차`;
  const dateText = (() => {
    if (!blockDetail?.date) return "";
    const date = new Date(blockDetail.date);
    if (Number.isNaN(date.getTime())) return blockDetail.date;
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  })();
  const timeText =
    blockDetail?.startTime && blockDetail?.endTime
      ? `${blockDetail.startTime}~${blockDetail.endTime}`
      : "";

  const openInNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEditMemo = () => {
    setMemoDraft(memo);
    setIsEditingMemo(true);
  };

  const handleSaveMemo = () => {
    if (updateBlockMutation.isPending) return;

    const nextMemo = memoDraft.slice(0, MEMO_MAX_LENGTH);
    if (nextMemo === memo) {
      setIsEditingMemo(false);
      return;
    }

    updateBlockMutation.mutate(
      { memo: nextMemo },
      {
        onSuccess: () => {
          setIsEditingMemo(false);
        },
      },
    );
  };

  const handleOpenOpinionEditor = (opinion: BlockOpinion) => {
    const initialReasonIds = [
      ...opinion.tag_ids.map(Number),
      ...(opinion.comment ? [CUSTOM_INPUT_REASON_ID] : []),
    ];

    setEditCurrentState(opinion.type);
    setEditReasonIdsByState({
      ...EMPTY_REASON_IDS_BY_STATE,
      [opinion.type]: initialReasonIds,
    });
    setEditCustomTextByState({
      ...EMPTY_CUSTOM_TEXT_BY_STATE,
      [opinion.type]: opinion.comment ?? "",
    });
    setEditingOpinion(opinion);
  };

  const handleOpenDeleteConfirm = (opinion: BlockOpinion) => {
    setDeletingOpinion(opinion);
    setDeleteConfirmOpen(true);
  };

  const closeOpinionEditor = () => {
    setEditingOpinion(null);
    setDeletingOpinion(null);
    setDeleteConfirmOpen(false);
  };

  const handleConfirmOpinionUpdate = () => {
    if (!editingOpinion || updateBlockOpinionMutation.isPending || !hasChanged) return;

    const hasCustomInput = editCurrentReasonIds.includes(CUSTOM_INPUT_REASON_ID);
    const tagIds = editCurrentReasonIds.filter((id) => id !== CUSTOM_INPUT_REASON_ID).map(String);

    updateBlockOpinionMutation.mutate(
      {
        opinionId: editingOpinion.opinion_Id,
        payload: {
          type: editCurrentState,
          tag_ids: tagIds,
          ...(hasCustomInput ? { comment: editCurrentCustomText.trim() } : { comment: "" }),
        },
      },
      {
        onSuccess: () => {
          closeOpinionEditor();
        },
      },
    );
  };

  return (
    <div className="relative min-h-screen min-w-0 overflow-x-clip pb-[calc(72px+env(safe-area-inset-bottom)+16px)]">
      <Header showBackButton leftBtnBgVariant="glass" className="fixed inset-x-0 top-0 z-50" />
      <div className="bg-muted fixed top-0 right-0 left-0 z-0 aspect-5/3 w-full">
        {coverImageUrl && (
          <Image src={coverImageUrl} alt={placeName} fill className="object-cover" priority />
        )}
      </div>

      <div className="relative pt-[calc(60%-17px)]">
        <div className="bg-background flex min-w-0 flex-col gap-16 rounded-t-2xl px-5 pt-7">
          <div className="flex w-full min-w-0 flex-col">
            <h2 className="flex h-8 w-full items-center justify-between px-1 py-0.5">
              <span className="typography-title-lg-sb text-foreground">{placeName}</span>
              <span className="typography-body-sm-bold text-muted-foreground">{category}</span>
            </h2>
            <div className="flex w-full flex-1 flex-col gap-5 pt-4">
              <div className="flex w-full flex-col gap-1">
                <hr className="border-border" />
                <div className="flex h-11 w-full items-center justify-between">
                  <div className="flex items-center gap-2.25">
                    <MapPin className="size-6 text-[#0EA5E9]" />
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
              <div className="flex w-full flex-col gap-1">
                <div className="flex h-9.5 w-full flex-col gap-3.5">
                  <div className="flex h-6 w-full items-center justify-between">
                    <div className="flex h-6 items-center gap-1.75">
                      <Calendar className="size-6 text-[#0EA5E9]" />
                      <span className="typography-body-sm-sb align-middle text-black">
                        {dayText}
                      </span>
                      <span className="typography-body-sm-reg text-muted-foreground align-middle">
                        {dateText}
                      </span>
                    </div>
                    <div className="flex h-6 items-center gap-1.75">
                      <span className="typography-body-sm-reg text-muted-foreground align-middle">
                        {timeText}
                      </span>
                    </div>
                  </div>
                </div>
                <hr className="border-border" />
              </div>
              <div className="flex w-full flex-col gap-0">
                <Label
                  isEditing={isEditingMemo}
                  onEdit={handleEditMemo}
                  onSave={handleSaveMemo}
                  className="h-9 w-full"
                >
                  <span className="typography-label-sm-sb text-foreground align-middle">메모</span>
                </Label>
                <div className="w-full">
                  {isEditingMemo ? (
                    <Textarea
                      placeholder="텍스트를 입력해주세요."
                      value={memoDraft}
                      onChange={(e) => setMemoDraft(e.target.value.slice(0, MEMO_MAX_LENGTH))}
                      maxLength={MEMO_MAX_LENGTH}
                      className="typography-body-base! text-foreground!"
                      disabled={updateBlockMutation.isPending}
                    />
                  ) : (
                    <div className="flex items-start gap-2.5 py-2.5">
                      <p className="typography-body-base text-foreground w-full align-middle wrap-break-word whitespace-pre-wrap">
                        {memo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
              <div className="flex w-full flex-col gap-4">
                <div className="flex h-6 w-full items-center justify-between">
                  <div className="flex h-6 w-full items-center">
                    <span className="typography-label-base-sb align-middle text-black">
                      팀원들의 의견
                    </span>
                  </div>
                </div>
                {!myOpinionId && (
                  <div className="bg-background sticky top-0 z-40 -mx-5 px-5 py-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingOpinion(true)}
                      className="flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-[#E2E2E2] bg-transparent px-4"
                    >
                      <span className="typography-body-base text-[#757575]">
                        의견을 남기시겠어요?
                      </span>
                      <MessageCircle className="size-5 shrink-0 text-[#757575]" strokeWidth={2} />
                    </button>
                  </div>
                )}
                <div className="flex w-full flex-col gap-6">
                  {opinions.length === 0 ? (
                    <div className="bg-card typography-body-sm-reg text-muted-foreground flex h-20 items-center justify-center rounded-xl">
                      아직 등록된 의견이 없어요.
                    </div>
                  ) : (
                    opinions.map((opinion) => (
                      <div key={opinion.opinion_Id} className="flex w-full flex-col gap-2.25">
                        <OpinionProfile
                          nickname={opinion.added_by.nickname}
                          picture={opinion.added_by.picture}
                          isOwn={myOpinionId === opinion.opinion_Id}
                          onEdit={() => handleOpenOpinionEditor(opinion)}
                          onDelete={() => handleOpenDeleteConfirm(opinion)}
                        />
                        <OpinionCard
                          opinion={opinion}
                          categoryKey={opinionCategoryKey}
                          showDividerBetweenTagsAndComment
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {isError && (
              <p className="typography-caption-xs-reg text-destructive px-1">
                블록 정보를 불러오지 못했습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {editingOpinion && (
        <OpinionBottomSheet
          open={!!editingOpinion}
          onOpenChange={(open) => {
            if (!open) setEditingOpinion(null);
          }}
          categoryKey={opinionCategoryKey}
          state={editCurrentState}
          selectedReasonIds={editCurrentReasonIds}
          customInputText={editCurrentCustomText}
          onStateChange={setEditCurrentState}
          onSelectedReasonIdsChange={(selectedReasonIds) => {
            setEditReasonIdsByState((prev) => ({
              ...prev,
              [editCurrentState]: selectedReasonIds,
            }));
          }}
          onCustomInputTextChange={(text) => {
            setEditCustomTextByState((prev) => ({
              ...prev,
              [editCurrentState]: text,
            }));
          }}
          cancelLabel="의견 삭제"
          confirmLabel="수정 완료"
          confirmDisabled={!hasChanged || updateBlockOpinionMutation.isPending}
          closeOnCancel={false}
          onCancel={() => setDeleteConfirmOpen(true)}
          onConfirm={handleConfirmOpinionUpdate}
        />
      )}

      {isAddingOpinion && (
        <OpinionBottomSheet
          open={isAddingOpinion}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddingOpinion(false);
              setAddCurrentState("POSITIVE");
              setAddReasonIdsByState(EMPTY_REASON_IDS_BY_STATE);
              setAddCustomTextByState(EMPTY_CUSTOM_TEXT_BY_STATE);
            }
          }}
          categoryKey={opinionCategoryKey}
          state={addCurrentState}
          selectedReasonIds={addCurrentReasonIds}
          customInputText={addCurrentCustomText}
          onStateChange={setAddCurrentState}
          onSelectedReasonIdsChange={(selectedReasonIds) => {
            setAddReasonIdsByState((prev) => ({
              ...prev,
              [addCurrentState]: selectedReasonIds,
            }));
          }}
          onCustomInputTextChange={(text) => {
            setAddCustomTextByState((prev) => ({
              ...prev,
              [addCurrentState]: text,
            }));
          }}
          cancelLabel="취소"
          confirmLabel="등록"
          onCancel={() => setIsAddingOpinion(false)}
          confirmDisabled={createBlockOpinionMutation.isPending}
          onConfirm={() => {
            if (createBlockOpinionMutation.isPending) return;

            const hasCustomInput = addCurrentReasonIds.includes(CUSTOM_INPUT_REASON_ID);
            const tagIds = addCurrentReasonIds
              .filter((id) => id !== CUSTOM_INPUT_REASON_ID)
              .map(String);

            createBlockOpinionMutation.mutate(
              {
                type: addCurrentState,
                tag_ids: tagIds,
                ...(hasCustomInput ? { comment: addCurrentCustomText.trim() } : { comment: "" }),
              },
              {
                onSuccess: () => {
                  setIsAddingOpinion(false);
                  setAddCurrentState("POSITIVE");
                  setAddReasonIdsByState(EMPTY_REASON_IDS_BY_STATE);
                  setAddCustomTextByState(EMPTY_CUSTOM_TEXT_BY_STATE);
                },
              },
            );
          }}
        />
      )}

      <AppAlertDialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => {
          if (!open) closeOpinionEditor();
        }}
        title="의견을 삭제하시겠습니까?"
        description="의견 삭제 후엔 남겼던 의견 데이터를 되돌릴 수 없어요."
        cancelLabel="취소"
        onCancel={() => closeOpinionEditor()}
        actionLabel="삭제하기"
        actionDisabled={deleteBlockOpinionMutation.isPending}
        onAction={() => {
          const target = deletingOpinion ?? editingOpinion;
          if (!target || deleteBlockOpinionMutation.isPending) return;

          deleteBlockOpinionMutation.mutate(
            { opinionId: target.opinion_Id },
            {
              onSuccess: () => {
                closeOpinionEditor();
              },
            },
          );
        }}
      />

      <NavigationBar className="fixed right-0 bottom-0 left-0 z-50" />
    </div>
  );
};

export default BlockDetailPage;
