import { AxiosResponse } from "axios";

interface IAPIResponse<T> extends AxiosResponse {
  error?: string;
  isSuccess: boolean;
  value: T;
  paginationObject?: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}
export default IAPIResponse;
