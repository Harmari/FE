import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import DesignerFilterDrawer from "./DesignerFilterDrawer";
import { DesignerFilterMode, DesignerLocation, FilterOptions } from "@/types/types";
import { useEffect, useState } from "react";
import { getDesignerList } from "@/apis/designerList";
import { useQuery } from "@tanstack/react-query";
import QUERY_KEY from "@/constants/queryKey";

const FilterDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  setFilterOptions,
  filterOptions,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
  setFilterOptions: (filterOptions: FilterOptions) => void;
  filterOptions: FilterOptions;
}) => {
  const [selectedOption, setSelectedOption] = useState<FilterOptions>({
    designer_mode: undefined,
    designer_location: ["서울 전체"],
  });

  useEffect(() => {
    setSelectedOption(filterOptions);
  }, [filterOptions]);

  const handleModeChange = (mode: DesignerFilterMode) => {
    if (selectedOption.designer_mode === mode) {
      setSelectedOption((prev) => ({ ...prev, designer_mode: undefined }));
    } else {
      setSelectedOption((prev) => ({ ...prev, designer_mode: mode }));
    }
  };

  const handleLocationChange = (location: DesignerLocation) => {
    if (location === "서울 전체") {
      // 서울 전체 선택
      setSelectedOption((prev) => ({ ...prev, designer_location: ["서울 전체"] }));
    } else {
      if (selectedOption.designer_location?.includes(location)) {
        // 이미 선택된 지역 해제

        // 해당 지역을 제거한 배열
        const filteredLocation = selectedOption.designer_location.filter((loc) => loc !== location);

        setSelectedOption((prev) => ({
          ...prev,
          designer_location: filteredLocation,
        }));

        // 모든 지역이 제거되었으면 "서울 전체"를 추가
        if (filteredLocation.length === 0) {
          setSelectedOption((prev) => ({ ...prev, designer_location: ["서울 전체"] }));
        }
      } else {
        // 새로운 지역 추가시 "서울 전체"를 제거하고 해당 지역 추가
        const newLocations = selectedOption
          .designer_location!.filter((loc) => loc !== "서울 전체")
          .concat(location);
        setSelectedOption((prev) => ({
          ...prev,
          designer_location: newLocations,
        }));
      }
    }
  };

  const { data: designerList } = useQuery({
    queryKey: QUERY_KEY.designer.list({ ...selectedOption }),
    queryFn: () => getDesignerList(selectedOption),
  });

  const submitFilterOptions = () => {
    setFilterOptions(selectedOption);
    setIsDrawerOpen(false);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent className="min-w-[375px] max-w-[430px] m-auto px-[18px] pb-[18px]">
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        {/* 필터 */}
        <DesignerFilterDrawer
          selectedOption={selectedOption}
          handleModeChange={handleModeChange}
          handleLocationChange={handleLocationChange}
        />
        <DrawerFooter>
          <DrawerClose>
            <Button
              variant="outline"
              className="bg-[#D896FF] w-full text-white mt-[107px] rounded-[12px]"
              onClick={submitFilterOptions}
            >
              {designerList?.length}건의 결과보기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
