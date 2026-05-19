import { baseApi } from '../../../app/api/baseApi';
import type { ITask } from '../../../interfaces/task';
import type { ApiResponse } from '../../../interfaces/apiResponse';
import type { IBoard } from '../../../interfaces/board';

export const boardsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBoards: builder.query<IBoard[], void>({
            query: () => '/boards',
            transformResponse: (response: ApiResponse<IBoard[]>): IBoard[] => response.data,
            providesTags: ['Boards'],
        }),

        getTasksBoardById: builder.query<ITask[], string>({
            query: (boardId) => ({
                url: `/boards/${boardId}/tasks`,
                responseHandler: (response) => response.text(),
            }),
            
            transformResponse: (response: any) => {

            return response?.data ?? [];
            },
            
            async onCacheEntryAdded(boardId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;

                    const BASE_URL = import.meta.env.VITE_API_URL;

                    const response = await fetch(`${BASE_URL}/api/v1/boards/${boardId}/tasks`, {
                        method: 'GET',
                        credentials: 'include', 
                    });

                    if (!response.ok) {
                        console.error("❌ [STREAM TASKS] Backend ERROR:", response.status);
                        return;
                    }

                    const reader = response.body?.getReader();
                    if (!reader) return;

                    const decoder = new TextDecoder();
                    let buffer = '';
                    let count = 0;

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || '';

                        for (const line of lines) {
                            if (line.trim()) {
                                try {
                                    const task = JSON.parse(line);
                                    count++;
                                    
                                    updateCachedData((draft) => {
                                        const exists = draft.find(t => t.id === task.id);
                                        if (!exists) draft.push(task);
                                    });
                                } catch (e) {
                                    console.error("❌ [STREAM TASKS] Помилка парсингу:", line);
                                }
                            }
                        }
                    }

                    if (buffer.trim()) {
                        try {
                            const task = JSON.parse(buffer);
                            updateCachedData((draft) => {
                                const exists = draft.find(t => t.id === task.id);
                                if (!exists) draft.push(task);
                            });
                        } catch (e) {
                            console.error("❌ parse last chunk error:", buffer);
                        }
                    }
                    
                } catch (err) {
                    console.error('⚠️ [STREAM TASKS] Помилка:', err);
                }
                await cacheEntryRemoved;
            },
        }),

        getBoardById: builder.query<IBoard, string>({
            query: (boardId) => `/boards/${boardId}`,
            transformResponse: (response: ApiResponse<IBoard>) => response.data,
            providesTags: ['Boards'],
        }),

        createBoard: builder.mutation<IBoard, { name: string; description?: string }>({
            query: (body) => ({ url: '/boards', method: 'POST', body }),
            invalidatesTags: ['Boards'],
        }),

        updateBoard: builder.mutation<IBoard, { id: string; name: string; description?: string; }>({
            query: ({ id, ...body }) => ({ url: `/boards/${id}`, method: 'PUT', body }),
            invalidatesTags: ['Boards'],
        }),
        
        deleteBoard: builder.mutation<void, string>({
            query: (boardId) => ({ 
                url: `/boards/${boardId}`, 
                method: 'DELETE' 
            }),
            invalidatesTags: ['Boards'], 
            
            async onQueryStarted(boardId, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    
                    dispatch(
                        boardsApi.util.updateQueryData('getTasksBoardById', boardId, () => {
                            return []; 
                        })
                    );
                } catch (error) {
                    console.error("❌ Очищення тасок після видалення дошки зламалося:", error);
                }
            },
        }),
    }),
});

export const {
    useGetBoardsQuery,
    useGetBoardByIdQuery,
    useGetTasksBoardByIdQuery,
    useCreateBoardMutation,
    useUpdateBoardMutation,
    useDeleteBoardMutation,
} = boardsApi;
