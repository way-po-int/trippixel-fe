import Image from "next/image";

const BudgetEmptyState = () => {
  return (
    <>
      {/* Frame 1597881530 */}
      <div className="flex h-21 w-full flex-col gap-4 px-1.25 pt-1 pb-1" />

      {/* Frame 1597881306 */}
      <div className="flex flex-col items-center gap-5 pt-2.25">
        <Image src="/illust/budget-empty-illust.svg" alt="예산 비어있음" width={165} height={165} />
        <div className="flex flex-col items-center gap-2">
          <p className="text-foreground text-center text-lg leading-7 font-bold">
            여행 계획이 아직 없어요
          </p>
          <p className="text-foreground text-center text-sm leading-5 font-normal">
            예산을 정하기 위해
            <br />
            여행 일정에 장소를 추가해주세요
          </p>
        </div>
      </div>
    </>
  );
};

export default BudgetEmptyState;
