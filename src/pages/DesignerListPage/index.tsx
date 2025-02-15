import { getDesignerList } from "@/apis/designerList";
import QUERY_KEY from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import DesignerList from "./components/DesignerList";
import { useState } from "react";

import { DesignerFilterMode, DesignerLocation, FilterOptions } from "@/types/types";
import FilteredOptionBox from "./components/filteredOptionbox";
import FilterDrawer from "./components/filterDrawer";

const DesignerListPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    designer_mode: undefined,
    designer_location: ["서울 전체"],
  });

  const handleFilterOptions = (newOption: FilterOptions) => {
    setFilterOptions((prev) => ({
      ...prev,
      ...newOption,
    }));
  };

  // 모드 필터링 체크 함수
  const handleModeChange = (mode: DesignerFilterMode) => {
    if (filterOptions.designer_mode === mode) {
      handleFilterOptions({ designer_mode: undefined });
    } else {
      handleFilterOptions({ designer_mode: mode });
    }
  };

  // 지역 필터링 체크 함수
  const handleLocationChange = (location: DesignerLocation) => {
    if (location === "서울 전체") {
      // 서울 전체 선택
      handleFilterOptions({ designer_location: ["서울 전체"] });
    } else {
      if (filterOptions.designer_location?.includes(location)) {
        // 이미 선택된 지역 해제

        // 해당 지역을 제거한 배열
        const filteredLocation = filterOptions.designer_location.filter((loc) => loc !== location);

        handleFilterOptions({
          designer_location: filteredLocation,
        });

        // 모든 지역이 제거되었으면 "서울 전체"를 추가
        if (filteredLocation.length === 0) {
          handleFilterOptions({ designer_location: ["서울 전체"] });
        }
      } else {
        // 새로운 지역 추가시 "서울 전체"를 제거하고 해당 지역 주가
        const newLocations = filterOptions
          .designer_location!.filter((loc) => loc !== "서울 전체")
          .concat(location);
        handleFilterOptions({
          designer_location: newLocations,
        });
      }
    }
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

  // const user_id = "67ab499ba706f516fb348ddd";

  // const upcomingReservations = useMemo(() => {
  //   if (!reservationsData) return [];

  //   const now = dayjs("2025-04-20 12:01");

  //   const thirtyMinutesLater = now.add(30, "minute");

  //   return reservationsData.filter((reservation: Reservation) => {
  //     const reservationTime = formatDate(reservation.reservation_date_time);

  //     return (
  //       reservation.status !== "예약취소" && // 취소된 예약 제외
  //       reservationTime.isAfter(now) && // 현재 시간 이후
  //       reservationTime.isBefore(thirtyMinutesLater) // 30분 이내
  //     );
  //   });
  // }, [reservationsData]);

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
