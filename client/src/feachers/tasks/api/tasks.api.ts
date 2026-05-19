import { baseApi } from "../../../app/api/baseApi";
import type { ApiResponse } from "../../../interfaces/apiResponse";
import type { ITask } from "../../../interfaces/task";
import type { Workflow } from "../../../types/workflow.type";
import { boardsApi } from '../../boards/api/boards.api';

export const tasksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTaskById: builder.query<ITask, string>({
            query: (taskId) => `/tasks/${taskId}`,
            transformResponse: (response: ApiResponse<ITask>) => response.data,
            providesTags: (result, error, id) => [{ type: 'Tasks', id }],            
        }),

        createTask: builder.mutation<ITask, { title: string; description: string; workflow: string; boardId: string }>({
            query: (body) => ({
                url: '/tasks',
                method: 'POST',
                body,
            }),
            
            async onQueryStarted({ boardId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: createdTaskResponse } = await queryFulfilled;
                    
                    const newTask = (createdTaskResponse as any).data || createdTaskResponse;

                    dispatch(
                        boardsApi.util.updateQueryData('getTasksBoardById', boardId, (draft) => {
                            // Перевіряємо, чи немає її вже в кеші, і додаємо в масив
                            const exists = draft.find(t => t.id === newTask.id);
                            if (!exists) {
                                draft.push(newTask);
                            }
                        })
                    );
                } catch (error) {
                    console.error("❌ Помилка оновлення кешу після створення таски:", error);
                }
            },
        }),

        updateTask: builder.mutation<ITask, {id: string; title: string; description: string; boardId: string}>({
            query: ({id, ...body}) => ({
                url: `/tasks/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id, boardId }) => [
                { type: 'Tasks', id },
                { type: 'Tasks', id: `LIST-${boardId}` },
            ],
        }),


        updateTaskWorkflow: builder.mutation<ITask, { id: string; workflow: Workflow['code']; boardId: string }>({
            query: ({ id, workflow }) => ({
                url: `/tasks/${id}/workflow`,
                method: 'PUT',
                body: { workflow },
            }),

            async onQueryStarted({ id, workflow, boardId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    boardsApi.util.updateQueryData('getTasksBoardById', boardId, (draft) => {
                        const task = draft.find((t) => t.id === id);
                        if (task) {
                            task.workflow = workflow;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        deleteTask: builder.mutation<void, { id: string; boardId: string }>({
            query: ({ id }) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),

            async onQueryStarted({ id, boardId }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(
                        boardsApi.util.updateQueryData('getTasksBoardById', boardId, (draft) => {
                            // Перевіряємо обидва варіантно написання ID, щоб точно знайти таску
                            const index = draft.findIndex(t => t.id === id || (t as any)._id === id);
                            
                            if (index !== -1) {
                                draft.splice(index, 1);
                            }
                        })
                    );
                } catch (error) {
                    console.error("❌ Помилка очищення кешу після видалення таски:", error);
                }
            },
        }),
    })
});

export const {
    useGetTaskByIdQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useUpdateTaskWorkflowMutation,
    useDeleteTaskMutation,
} = tasksApi;
