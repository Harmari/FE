import { getDesignerList } from "@/apis/designerList";
import QUERY_KEY from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";
import DesignerList from "./components/DesignerList";
import { getReservationList } from "@/apis/reservation";
import { useMemo, useState } from "react";
import { Reservation } from "@/types/apiTypes";
import dayjs from "dayjs";
import ReservationItem from "./components/ReservationItem";
import { formatDate } from "@/utils/dayFormat";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import DesignerFilterDrawer from "./components/DesignerFilterDrawer";
import { DesignerFilterMode, DesignerLocation, FilterOptions } from "@/types/types";
import FilteredOptionBox from "./components/filteredOptionbox";

const DesignerListPage = () => {
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

  const user_id = "67ab499ba706f516fb348ddd";

  // {user_id} 예약 목록 조회
  const { data: reservationsData, isPending: reservationPending } = useQuery({
    queryKey: QUERY_KEY.reservationList.list(user_id),
    queryFn: () => getReservationList(user_id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const upcomingReservations = useMemo(() => {
    if (!reservationsData) return [];

    const now = dayjs("2025-04-20 12:01");

    const thirtyMinutesLater = now.add(30, "minute");

    return reservationsData.filter((reservation: Reservation) => {
      const reservationTime = formatDate(reservation.reservation_date_time);

      return (
        reservation.status !== "예약취소" && // 취소된 예약 제외
        reservationTime.isAfter(now) && // 현재 시간 이후
        reservationTime.isBefore(thirtyMinutesLater) // 30분 이내
      );
    });
  }, [reservationsData]);

  return (
    <>
      {reservationPending && <div>Loading...</div>}
      {upcomingReservations.length === 0 && <div>30분 이내 예약 없음</div>}
      {upcomingReservations.length > 0 && (
        <ReservationItem reservationData={upcomingReservations[0]}></ReservationItem>
      )}

      <div>
        {designerPending ? (
          <div>Loading...</div>
        ) : (
          <div className="w-full">
            <Drawer>
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

                <DrawerTrigger>
                  <div>
                    <img src="/images/mage_filter.svg" alt="필터" />
                  </div>
                </DrawerTrigger>
              </div>

              {/* 디자이너 리스트 */}
              <DesignerList designers={designerData.designer_list} />

              <DrawerContent className="min-w-[375px] max-w-[430px] m-auto px-[18px] pb-[18px]">
                <DrawerHeader>
                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                {/* 필터 */}
                <DesignerFilterDrawer
                  filterOptions={filterOptions}
                  handleModeChange={handleModeChange}
                  handleLocationChange={handleLocationChange}
                />
                <DrawerFooter>
                  <DrawerClose>
                    <Button
                      variant="outline"
                      className="bg-[#D896FF] w-full text-white mt-[107px] rounded-[12px]"
                    >
                      {designerData.designer_list.length}건의 결과보기
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </div>
    </>
  );
};

export default DesignerListPage;
