import type { Workflow } from "../types/workflow.type";

export interface ITask {
    id: string,
    title: string,
    description: string,
    workflow: "todo" | "progress" | "done",
    boardId: string,
    authorId: string
}
