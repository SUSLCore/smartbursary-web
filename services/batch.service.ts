import axiosInstance from "@/lib/axios";
import type { Batch } from "@/types/batch.types";

export type { Batch };

export interface CreateBatchPayload {
  name: string;
}

export interface CreateBatchResponse {
  message: string;
  batch: Batch;
}

export interface GetBatchesResponse {
  batches: Batch[];
}

export interface DeleteBatchResponse {
  message?: string;
}

export const getBatches = async (): Promise<Batch[]> => {
  const { data } = await axiosInstance.get<GetBatchesResponse>(
    "/api/batches"
  );

  return data.batches ?? [];
};

export const createBatch = async (
  payload: CreateBatchPayload
): Promise<CreateBatchResponse> => {
  const { data } = await axiosInstance.post<CreateBatchResponse>(
    "/api/batches",
    payload
  );

  return data;
};

export const deleteBatch = async (
  id: number
): Promise<DeleteBatchResponse> => {
  const { data } = await axiosInstance.delete<DeleteBatchResponse>(
    `/api/batches/${id}`
  );

  return data;
};

const batchService = {
  getBatches,
  createBatch,
  deleteBatch,
};

export default batchService;
