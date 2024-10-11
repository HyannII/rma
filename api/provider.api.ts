import {
  ICreateProviderBody,
  IDeleteProviderResponse,
  IProviderResponse,
  IUpdateProviderBody,
} from "../interfaces/provider.interface";
import api from "./api";

export const getAllProvidersApi = async () => {
  const res = await api.get<IProviderResponse[]>("/provider/getall");
  return res.data;
};

export const getProviderByIDApi = async (id: number) => {
  const res = await api.get<IProviderResponse>(`/provider/${id}`);
  return res.data;
};

export const getProviderByNameApi = async (name: string) => {
  const res = await api.get<IProviderResponse[]>(`/provider/getall`, {
    params: { name },
  });
  return res.data;
};

export const createProviderApi = async (body: ICreateProviderBody) => {
  const res = await api.post<IProviderResponse>("/provider", body);
  return res.data;
};

export const deleteProviderApi = async (id: number) => {
  const res = await api.delete<IDeleteProviderResponse>(`/provider/${id}`);
  return res.data;
};

export const updateProviderApi = async ({
  id,
  body,
}: {
  id: number;
  body: IUpdateProviderBody;
}) => {
  const res = await api.patch<IProviderResponse>(`/provider/${id}`, body);
  return res.data;
};
