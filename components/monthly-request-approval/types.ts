export type NoticeTone = "success" | "error" | "info";

export type NoticeState = {
  tone: NoticeTone;
  text: string;
} | null;
