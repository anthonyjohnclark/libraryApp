import { IPage } from "../../App";
import BookDetailsPage from "./FeaturedBooks/BookDetails";
import FeaturedBooks from "./FeaturedBooks/FeaturedBooks";

const PagesExport: IPage[] = [
  { component: FeaturedBooks, path: "" },
  { component: BookDetailsPage, path: "book-details/:id" },
];

export default PagesExport;
