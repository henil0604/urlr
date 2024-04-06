import { calculateLinkStatistics } from "@/lib/server-utils";

export type GetLinkDataApiResponseData = {
  id: string;
  url: string;
  createdAt: number;
  stats: Awaited<ReturnType<typeof calculateLinkStatistics>>;
};

export type GetLinkDataApiResponse =
  | {
      error: true;
      message: string;
    }
  | {
      error: false;
      message: string;
      data: GetLinkDataApiResponseData;
    };
