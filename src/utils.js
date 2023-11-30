import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const BASE_URL = "http://localhost:8080";

export const buildAnswer = (data, routerType = "api") => {
    const answer = {
        status: "success",
        payload: data.docs.map((doc) => doc.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage ? `${BASE_URL}/${routerType}/products?limit=${data.limit}&page=${data.prevPage}` : null,
        nextLink: data.hasNextPage ? `${BASE_URL}/${routerType}/products?limit=${data.limit}&page=${data.nextPage}` : null,
    }
    answer.prevLink && data.sort ? answer.prevLink += `&sort=${data.sort}` : null;
    answer.prevLink && data.query ? answer.prevLink += `&query=${data.query}` : null;
    answer.nextLink && data.sort ? answer.nextLink += `&sort=${data.sort}` : null;
    answer.nextLink && data.query ? answer.nextLink += `&query=${data.query}` : null;
    return answer;
};