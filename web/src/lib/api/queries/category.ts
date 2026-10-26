import { mutationOptions, queryOptions } from '@tanstack/react-query'

import { DEFAULT_PAGINATE } from '@/lib/constants/paginate'
import { getQueryClient } from '@/lib/providers/react-query'

import type { CategoryFormDto } from '../dtos/master/category/schema'
import type { PaginateDto } from '../dtos/paginate'

import { services } from '../services'

export const CATEGORY_QUERY_KEY = 'categories'

export const LIST_CATEGORY_QUERY_KEY = (params?: PaginateDto) => {
  return [CATEGORY_QUERY_KEY, 'list', params]
}

export const GET_CATEGORY_QUERY_KEY = (id: string) => {
  return [CATEGORY_QUERY_KEY, 'detail', id]
}

const list = (params?: PaginateDto & { search?: string; sorted?: string }) =>
  queryOptions({
    queryKey: LIST_CATEGORY_QUERY_KEY(params),
    queryFn: async () => {
      const res = await services.categories.list(params ?? DEFAULT_PAGINATE)
      return res.data
    },
  })

const get = (id: string) =>
  queryOptions({
    queryKey: GET_CATEGORY_QUERY_KEY(id),
    queryFn: async () => {
      const res = await services.categories.get(id)
      return res.data
    },
  })

const create = () => {
  const qc = getQueryClient()

  return mutationOptions({
    mutationFn: async (reqBody: CategoryFormDto) => {
      const res = await services.categories.store(reqBody)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] })
    },
  })
}

const update = (id: string) => {
  const qc = getQueryClient()

  return mutationOptions({
    mutationFn: async (reqBody: CategoryFormDto) => {
      const res = await services.categories.update(id, reqBody)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] })
    },
  })
}

const del = () => {
  const qc = getQueryClient()

  return mutationOptions({
    mutationFn: async (id: string) => {
      const res = await services.categories.delete(id)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] })
    },
  })
}

export const categoryQueries = { list, get, create, update, delete: del } as const
