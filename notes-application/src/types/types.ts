export interface Note {
    id: number;
    title: string;
    content: string;
    tag: "work" | "personal" | "ideas" | "reminders" | string;
    date: string;
}