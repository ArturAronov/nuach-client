import { create } from "zustand";

type studyTopicStoreT = {
  studyTopicStore: string | null;
  updateStudyTopic: (topic: string) => void;
};

export const useStudyTopic = create<studyTopicStoreT>()((set) => ({
  studyTopicStore: null,
  updateStudyTopic: (topic) => {
    if (topic) {
      return set(() => ({ studyTopicStore: topic }));
    }
  },
}));
