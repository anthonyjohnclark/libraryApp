import axios, { AxiosResponse } from "axios";
import ILoginRequest from "../models/HookModels/GlobalHookModels/IdentityInterfaces/ILoginRequest";
import IUser from "../models/HookModels/GlobalHookModels/IdentityInterfaces/IUser";
import IAPIResponse from "../models/HookModels/GlobalHookModels/APIInterfaces/IAPIResponse";
import ISignUpRequest from "../models/HookModels/GlobalHookModels/IdentityInterfaces/ISignUpRequest";
import { Book } from "../components/Pages/FeaturedBooks/FeaturedBooks";
import qs from "qs";
import { IBookDetails } from "../components/Pages/FeaturedBooks/BookDetails";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.response.use(async (response) => {
  const pagination = response.headers["pagination"];

  if (pagination) {
    let paginationParsed = JSON.parse(pagination);
    const paginationObject = {
      currentPage: paginationParsed.currentPage,
      itemsPerPage: paginationParsed.itemsPerPage,
      totalItems: paginationParsed.totalItems,
      totalPages: paginationParsed.totalPages,
    };

    response.data.paginationObject = paginationObject;
    return response;
  }
  return response;
});

const requests = {
  getUser: <T>(url: string) => axios.get<T>(url).then(responseBody),
  get: <T>(url: string, params?: any) =>
    axios
      .get<IAPIResponse<T>>(url, {
        params,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<IAPIResponse<T>>(url, body).then(responseBody),
  loginPost: <IUser>(url: string, body: {}) =>
    axios.post<IUser>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) =>
    axios.put<IAPIResponse<T>>(url, body).then(responseBody),
  del: <T>(url: string) =>
    axios.delete<IAPIResponse<T>>(url).then(responseBody),
};

const User = {
  current: () => requests.getUser<IUser>("/user"),
  login: (user: ILoginRequest) =>
    requests.loginPost<IUser>("/user/login", user),
  signUp: (newUser: ISignUpRequest) => requests.post("/user/signUp", newUser),
  refreshToken: () => requests.post<IUser>("/user/refreshToken", {}),
  logout: () => requests.post("/user/logout", {}),
};

const Books = {
  getBookDetails: (id: string) => requests.get<IBookDetails>(`/books/${id}`),
  getAuthors: () => requests.get<string[]>(`/books/authors`),
  getBooks: (filterSearchParams: any) =>
    requests.get<Book[]>(`/books/featured`, filterSearchParams),
  addBook: (book: any) => requests.post("/books", book),
  editBook: (id: number, book: any) => requests.put<Book>(`/books/${id}`, book),
  deleteBook: (id: number) => requests.del(`/books/${id}`),
  checkoutBook: (id: number, custId: string | undefined) =>
    requests.post(`/books/${id}/${custId}/checkout`, {}),
  returnBook: (id: number) => requests.post(`/books/${id}/return`, {}),
  addReview: (review: any) => requests.post(`/books/review`, review),
};

const agent = {
  User,
  Books,
};

export default agent;
