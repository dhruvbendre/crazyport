import { Avatar } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import type { AvatarDefinition } from "@bible-strong/avatar-core";

type Props = {
  definition: AvatarDefinition;
  /** One of the definition's animation keys (see data/companions.ts). */
  mood: string;
  name: string;
  size?: number | string;
  className?: string;
};

/**
 * A companion's body: a procedural avatar driven by one mood at a time.
 * Every companion definition shares the same animation vocabulary, so the
 * mood string is simply the animation to play.
 */
export function CompanionAvatar({ definition, mood, name, size = 120, className }: Props) {
  return <Avatar definition={definition} animation={mood} size={size} className={className} ariaLabel={`${name}, ${mood}`} />;
}
