import { memo, type Ref } from "react";
import { Avatar, type AvatarController } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import type { AvatarDefinition } from "@bible-strong/avatar-core";

type Props = {
  definition: AvatarDefinition;
  /** One of the definition's animation keys (see data/companions.ts). */
  mood: string;
  name: string;
  size?: number | string;
  className?: string;
  /** Playback controller (pause / play), for the frame governor. */
  controller?: Ref<AvatarController>;
};

/**
 * A companion's body: a procedural avatar driven by one mood at a time.
 * Every companion definition shares the same animation vocabulary, so the
 * mood string is simply the animation to play.
 */
export const CompanionAvatar = memo(function CompanionAvatar({ definition, mood, name, size = 120, className, controller }: Props) {
  return <Avatar ref={controller} definition={definition} animation={mood} size={size} className={className} ariaLabel={`${name}, ${mood}`} />;
});
// Memoised: the avatar library recomputes and rewrites its whole geometry in a
// layout effect on every render, so a parent re-render that leaves the mood
// unchanged (a pace flip, a scroll state change) must not reach it.
