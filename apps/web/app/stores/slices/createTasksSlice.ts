import { notifications } from "@mantine/notifications";
import type { StateCreator } from "zustand";

export interface TaskMetadata {
    id: string;
    title: string;
    notify?: boolean;
    progress?: number;
};

export interface TaskMetadataInput extends Omit<TaskMetadata, "id"> { };

export interface TaskContext {
    onProgress?: (progress: number) => void;
};

export interface TaskExecute<T = any, Ctx extends TaskContext = TaskContext> {
    (ctx: Ctx): Promise<T>;
}

export interface TasksStore {
    tasks: TaskMetadata[];
    addTask: <T = any>(meta: TaskMetadataInput, run: TaskExecute<T>) => Promise<T>;
};

export const createTasksSlice = <TOutput>(): StateCreator<
    TasksStore
> => (set, get) => ({
    tasks: [] as TaskMetadata[],
    addTask: async <T = any>(meta: TaskMetadataInput, run: TaskExecute<T>): Promise<T> => {
        const id = `task-${Date.now()}-${Math.random()}`;
        const task: TaskMetadata = {
            id,
            title: meta.title,
        };
        set((state) => ({
            tasks: [...state.tasks, task],
        }));
        try {
            if (meta.notify) notifications.show({
                id,
                message: task.title,
                color: "blue",
                loading: true,
            });
            const result = await run({
                onProgress: (progress: number) => {
                    if(meta.notify) notifications.update({
                        id,
                        message: `${task.title} - ${Math.round(progress * 100)}%`,
                    });
                    set((state) => ({
                        tasks: state.tasks.map((t) =>
                            t.id === task.id ? { ...t, progress } : t
                        ),
                    }));
                },
            });
            if (meta.notify) notifications.update({
                id,
                message: "Task Complete: " + task.title,
                color: "green",
                loading: false,
            });
            return result;
        } catch (error) {
            console.error("Task Error:", error);
            const notification = {
                id,
                title: "Task Error: " + task.title,
                message: error instanceof Error ? error.message : String(error),
                color: "red",
            };
            if (meta.notify) notifications.update(notification);
            else notifications.show(notification);
            throw error;
        } finally {
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== task.id),
            }));
        }
    },
});
