import type { Workflow } from "../types/workflow.type";

export interface ITask {
    id: string,
    title: string,
    description: string,
    workflow: Workflow['code'],
    boardId: string,
    authorId: string
}
