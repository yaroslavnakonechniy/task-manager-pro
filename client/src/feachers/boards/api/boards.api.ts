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

        getBoardById: builder.query<IBoard, string>({
            query: (boardId) => `/boards/${boardId}`,
            transformResponse: (response: ApiResponse<IBoard>) => response.data,
            providesTags: ['Boards'],
        }),

        /* getTasksBoardById: builder.query<ITask[], string>({
            query: (boardId) => `/boards/${boardId}/tasks`,
            transformResponse: (response: ApiResponse<ITask[]>): ITask[] => response.data,
            providesTags: (result, error, boardId) =>
                result
                ? [
                    ...result.map(({ id }) => ({ type: 'Tasks' as const, id })),
                    { type: 'Tasks', id: `LIST-${boardId}` },
                    ]
                : [{ type: 'Tasks', id: `LIST-${boardId}` }],
        }), */

        getTasksBoardById: builder.query<ITask[], string>({
            query: (boardId) => ({
                url: `/boards/${boardId}/tasks`,
                responseHandler: (response) => response.text(), // 👈 Важливо: кажемо RTK не парсити JSON автоматично
            }),
            transformResponse: () => [] as ITask[], // Початковий стан — порожній масив
            
            async onCacheEntryAdded(boardId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;

                    // СТУЧИМСЯ НА ПОРТ 3000
                    const response = await fetch(`http://localhost:3000/api/v1/boards/${boardId}/tasks`, {
                        method: 'GET',
                        // Это заставит браузер отправить ваши Cookies на бэкенд
                        credentials: 'include', 
                    });

                    if (!response.ok) {
                        console.error("Backend ERROR:", response.status);
                        return;
                    }

                    const reader = response.body?.getReader();
                    if (!reader) return;

                    const decoder = new TextDecoder();
                    let buffer = '';

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
                                    
                                    updateCachedData((draft) => {
                                        const exists = draft.find(t => t.id === task.id);
                                        if (!exists) draft.push(task);
                                    });
                                } catch (e) {
                                    console.error("Parsing String ERROR:", line);
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.error('Strim does noy work:', err);
                }
            },
        }),

        createBoard: builder.mutation<IBoard, { name: string; description?: string }>({
            query: (body) => ({
                url: '/boards',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Boards'],
        }),

        updateBoard: builder.mutation<IBoard, { id: string; name: string; description?: string; }>({
            query: ({ id, ...body }) => ({
                url: `/boards/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Boards'],
        }),

        deleteBoard: builder.mutation<void, string>({
            query: (boardId) => ({
                url: `/boards/${boardId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Boards'],
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
