import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

/**
 * The "bloim" Unicorn Studio scene (project 9tVO0xGS8DIar1DF4Sqc), the
 * doorway of the portfolio intro.
 *
 * This is a Vite app, so no "use client" directive is needed: everything
 * here already runs in the browser only.
 */
export const BLOIM_PROJECT_ID = "9tVO0xGS8DIar1DF4Sqc";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize((prev) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Only re-render when the size actually changed.
        return prev.width === width && prev.height === height ? prev : { width, height };
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

type BloimProps = {
  className?: string;
  /** The scene has rendered its first frame. */
  onLoad?: () => void;
  /** The scene could not start (offline, WebGL unavailable ...). */
  onError?: (error: unknown) => void;
};

/**
 * The scene sized to the full viewport. Used by the intro; the supplied
 * `Component` below keeps the original demo shape.
 */
export const BloimBackground = ({ className, onLoad, onError }: BloimProps) => {
  const { width, height } = useWindowSize();

  return (
    <div className={cn("flex flex-col items-center", className)} aria-hidden="true">
      <UnicornScene
        production={true}
        projectId={BLOIM_PROJECT_ID}
        width={width}
        height={height}
        dpi={1}
        lazyLoad={false}
        showPlaceholderWhileLoading={false}
        showPlaceholderOnError={false}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
};

export const Component = () => {
  const { width, height } = useWindowSize();

  return (
    <div className={cn("flex flex-col items-center")}>
      <UnicornScene production={true} projectId={BLOIM_PROJECT_ID} width={width} height={height} />
    </div>
  );
};
