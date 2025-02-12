import axios from "axios";
import { RESERVATION_ENDPOINT } from "./endpoints";

export const getReservationList = async () => {
  const user_id = "67ab499ba706f516fb348ddd";
  try {
    const response = await axios.get(RESERVATION_ENDPOINT.get_list(user_id));
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
