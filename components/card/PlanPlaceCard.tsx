import Image from "next/image";
import PlaceTypeIcon, { type PlaceType } from "@/components/card/PlaceTypeIcon";
import Writer from "@/components/card/Writer";
import PlaceReactionItem, { type ReactionType } from "@/components/card/PlaceReactionItem";
import OpinionBtn from "@/components/card/OpinionBtn";
import { cn } from "@/lib/utils/utils";
import HeaderBtn from "../layout/HeaderBtn";
import { ChevronRight, CircleCheck, Ellipsis } from "lucide-react";

type Reactions = {
  good: number;
  normal: number;
  bad: number;
};

type PlanPlaceCardProps = {
  placeType: PlaceType;
  placeName: string;
  writerNickname: string;
  writerProfileImageUrl: string;
  imageUrl?: string;
  memo?: string;
  reactions?: Reactions;
  activeReaction?: ReactionType;
  opinionCount?: number;
  onReactionClick?: (type: ReactionType) => void;
  onOpinionClick?: () => void;
  onMenuClick?: () => void;
  isView?: boolean;
  isFree?: boolean;
  isFixedCandidate?: boolean;
  candidateCount?: number;
  onReselectCandidate?: () => void;
  onDetailClick?: () => void;
  onFreeClick?: () => void;
  className?: string;
};

const REACTION_TYPES: ReactionType[] = ["good", "normal", "bad"];

const PlanPlaceCard = ({
  placeType,
  placeName,
  writerNickname,
  writerProfileImageUrl,
  imageUrl,
  memo,
  reactions,
  activeReaction,
  opinionCount,
  onReactionClick,
  onOpinionClick,
  onMenuClick,
  isView = true,
  isFree = false,
  isFixedCandidate = false,
  candidateCount,
  onReselectCandidate,
  onDetailClick,
  onFreeClick,
  className,
}: PlanPlaceCardProps) => {
  return (
    <div
      onClick={onFreeClick}
      className={cn(
        "border-border bg-background flex w-full flex-col rounded-2xl border shadow-xs",
        isFree && "cursor-pointer",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5 pb-4">
        <div className="flex items-start gap-2 pr-1.5">
          <div className="shrink-0">
            <PlaceTypeIcon type={placeType} />
          </div>
          <span
            className="typography-display-base-bold text-foreground"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {placeName}
          </span>
        </div>
        <div className="shrink-0">
          <Writer nickname={writerNickname} profileImageUrl={writerProfileImageUrl} />
        </div>
      </div>

      {/* Image */}
      {isView && (
        <div
          onClick={onDetailClick}
          className="relative aspect-8/5 w-full cursor-pointer bg-[#f0f0f0]"
        >
          {imageUrl ? (
            <Image src={imageUrl} alt={placeName} fill className="object-cover" />
          ) : (
            <div className="text-muted-foreground typography-body-sm-reg absolute inset-0 flex items-center justify-center">
              사진 없음
            </div>
          )}
        </div>
      )}

      {/* Memo / Memo + MenuButton */}
      <div
        className={cn(
          !isView ? "flex items-center justify-between pr-3 pb-3.5 pl-4" : "px-5 pt-3 pb-3",
        )}
      >
        {!isView && !isFree ? (
          <>
            {/* memo가 없어도 자리 차지 */}
            <p className="typography-body-sm-reg text-muted-foreground min-w-0 flex-1 break-all">
              {memo ?? ""}
            </p>
            <HeaderBtn
              icon={Ellipsis}
              label="일정 메뉴"
              bgVariant="ghost"
              onClick={onMenuClick}
              className="shrink-0 self-start"
            />
          </>
        ) : (
          memo && (
            <p className="typography-body-sm-reg text-muted-foreground min-w-0 break-all">{memo}</p>
          )
        )}
      </div>

      {/* Footer */}
      {isView && (
        <div className="border-border flex items-center justify-between border-t border-dashed pt-3 pr-4 pb-3.5 pl-3">
          <div className="flex items-center">
            {REACTION_TYPES.map((type) => (
              <PlaceReactionItem
                key={type}
                type={type}
                count={reactions?.[type] ?? 0}
                active={activeReaction === type}
                onClick={() => onReactionClick?.(type)}
              />
            ))}
          </div>
          <OpinionBtn count={opinionCount ?? 0} onClick={onOpinionClick} />
        </div>
      )}
      {isFixedCandidate && (
        <div
          className={cn(
            "flex items-center justify-between px-4 pb-3.5",
            !isView && "border-border border-t border-dashed pt-3",
          )}
        >
          <button
            type="button"
            className="typography-nav-xl-reg text-muted-foreground flex w-full items-center justify-center gap-1 rounded-lg bg-[#f0f0f0] px-2.5 py-2"
            onClick={onReselectCandidate}
          >
            <CircleCheck className="size-4 shrink-0 text-sky-500" />
            <span className="text-foreground">총 {candidateCount}개의 후보지 중 다시 선택하기</span>
            <ChevronRight className="size-4 shrink-0 stroke-3 opacity-40" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanPlaceCard;
