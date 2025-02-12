export const serverURL = import.meta.env.VITE_API_BASE_URL;

// 로컬 서버 엔드포인트
export const localURL = "http://localhost:3001";

interface ReservationEndpoint {
  list: string;
  get_list: string;
}

interface LocalEndpoint {
  designers: string;
}

/**
# ======================#
|       RESERVATION     |
# ======================#
*/

export const RESERVATION_ENDPOINT: ReservationEndpoint = Object.freeze({
  list: `${serverURL}/reservations/list`, // 디자이너 예약 목록 조회
  get_list: `${serverURL}/reservations/get_list`, // 사용자 예약 내역 조회
});

/**
# ======================#
|         LOCAL         |
# ======================#
*/

export const LOCAL_ENDPOINT: LocalEndpoint = Object.freeze({
  designers: `${localURL}/designers`,
});
