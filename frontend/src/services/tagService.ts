import API from './api';
import { Tag } from '@/types/store';



/**
 * Fetch all tags from the API
 * @returns Promise<Tag[]>
 */
export const fetchTags = async (): Promise<Tag[]> => {
    const response = await API.get<Tag[]>('/tags');
    return response.data;
  };


  export const getAllTags = async (): Promise<Tag[]> => {
    const res = await API.get('/tags');
    return res.data;
  };
  
  export const createTag = async (data: { name: string; description?: string }) => {
    const res = await API.post('/tags', data);
    return res.data;
  };
  
  export const updateTag = async (id: number, data: Partial<Tag>) => {
    const res = await API.put(`/tags/${id}`, data);
    return res.data;
  };
  
  export const deleteTag = async (id: number) => {
    const res = await API.delete(`/tags/${id}`);
    return res.data;
  };

  export const getTagWithCount = async (): Promise<Tag[]> => {
    const res = await API.get('/tags/count');
    return res.data;
  };

  export const assignTagToEntity = async (data: { tag_id: number; entity_type: string; entity_id: number }) => {
    const res = await API.post('/tags/assign', data);
    return res.data;
  };

  