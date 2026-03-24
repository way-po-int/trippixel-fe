type CandidatePinProps = {
  index: number;
};

const CandidatePin = ({ index }: CandidatePinProps) => {
  return (
    <div className="inline-flex flex-col items-center">
      {/* 본체 - 검은 원 + 흰 테두리 */}
      <div className="flex size-8 items-center justify-center rounded-full border-3 border-white bg-black shadow-lg">
        <span className="typography-body-sm-bold leading-none text-white">{index}</span>
      </div>

      {/* 꼬리 - 흰색 삼각형 */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "7px solid white",
          marginTop: "-1px",
        }}
      />
    </div>
  );
};

export default CandidatePin;
