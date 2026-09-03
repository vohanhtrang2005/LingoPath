import React from "react";
import { BookOpenTextIcon, HeadphonesIcon, PenLineIcon, SpellCheckIcon, BoxIcon } from "lucide-react";
import { LessonType } from "../../types/lesson";
interface TypeStyle {
  icon: BoxIcon;
  badge: string;
  tile: string;
}
export const LESSON_TYPE_STYLE: Record<LessonType, TypeStyle> = {
  Vocabulary: {
    icon: SpellCheckIcon,
    badge: 'bg-mint-100 text-[#38795c]',
    tile: 'bg-mint-100 text-[#38795c]'
  },
  Grammar: {
    icon: BookOpenTextIcon,
    badge: 'bg-sky-100 text-[#3b6a94]',
    tile: 'bg-sky-100 text-[#3b6a94]'
  },
  Listening: {
    icon: HeadphonesIcon,
    badge: 'bg-peach-100 text-[#a1552c]',
    tile: 'bg-peach-100 text-[#a1552c]'
  },
  Kanji: {
    icon: PenLineIcon,
    badge: 'bg-[#ece7fb] text-[#5f4f9c]',
    tile: 'bg-[#ece7fb] text-[#5f4f9c]'
  }
};
export function TypeBadge({
  type


}: {type: LessonType;}) {
  const style = LESSON_TYPE_STYLE[type];
  const Icon = style.icon;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs font-bold ${style.badge}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {type}
    </span>;
}
export function TypeTile({
  type


}: {type: LessonType;}) {
  const style = LESSON_TYPE_STYLE[type];
  const Icon = style.icon;
  return <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.1rem] ${style.tile}`} aria-hidden="true">
      <Icon className="h-5 w-5" />
    </span>;
}