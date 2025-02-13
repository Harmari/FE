const FilteredOptionBox = ({ option }: { option: string }) => {
  return (
    <div className="text-[#868686] text-[14px] flex items-center gap-1">
      <span>{option}</span>
      <img src="images/delete_option.svg" alt="옵션 삭제" />
    </div>
  );
};

export default FilteredOptionBox;
