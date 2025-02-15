import { getDesignerList } from "@/apis/designerList";
import QUERY_KEY from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import DesignerList from "./components/DesignerList";
import { useState } from "react";

import { DesignerFilterMode, DesignerLocation, FilterOptions } from "@/types/types";
import FilteredOptionBox from "./components/filteredOptionbox";
import FilterDrawer from "./components/filterDrawer";
import { handleLocation, handleMode } from "@/utils/filterOption";

const DesignerListPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    designer_mode: undefined,
    designer_location: ["서울 전체"],
  });

  // 모드 필터링 체크 함수
  const handleModeChange = (mode: DesignerFilterMode) => {
    handleMode(mode, filterOptions, setFilterOptions);
  };

  // 지역 필터링 체크 함수
  const handleLocationChange = (location: DesignerLocation) => {
    handleLocation(location, filterOptions, setFilterOptions);
  };

  // 디자이너 리스트 조회
  const { data: designerData, isPending: designerPending } = useQuery({
    queryKey: QUERY_KEY.designer.list({ ...filterOptions }),
    queryFn: () => getDesignerList(filterOptions),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <>
      <div>
        {designerPending ? (
          <div>Loading...</div>
        ) : (
          <div className="w-full">
            <div className="w-full flex justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2 w-[80%]">
                {/* 지역 필터링 */}
                {filterOptions.designer_location?.map((option) => (
                  <FilteredOptionBox
                    key={option}
                    option={option}
                    type={"location"}
                    handleLocationChange={handleLocationChange}
                    handleModeChange={handleModeChange}
                  ></FilteredOptionBox>
                ))}
                {/* 모드 필터링 */}
                {filterOptions.designer_mode && (
                  <FilteredOptionBox
                    option={filterOptions.designer_mode}
                    type={"mode"}
                    handleModeChange={handleModeChange}
                    handleLocationChange={handleLocationChange}
                  ></FilteredOptionBox>
                )}
              </div>

              <div onClick={() => setIsDrawerOpen(true)} className="cursor-pointer">
                <img src="/images/mage_filter.svg" alt="필터" />
              </div>
            </div>

            {/* 디자이너 리스트 */}
            <DesignerList designers={designerData} />

            <FilterDrawer
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              setFilterOptions={setFilterOptions}
              filterOptions={filterOptions}
            ></FilterDrawer>
          </div>
        )}
      </div>
    </>
  );
};

export default DesignerListPage;
