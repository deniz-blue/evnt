import { create } from "zustand";
import { createTasksSlice, type TasksStore } from "./slices/createTasksSlice";

export const useTasksStore = create<TasksStore>()(createTasksSlice());
