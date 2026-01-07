"use client";

import { useEffect, useState } from "react";
import {
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";

interface StrictModeDroppableProps extends Omit<DroppableProps, "children"> {
  children: (
    provided: DroppableProvided,
    snapshot: DroppableStateSnapshot
  ) => React.ReactElement;
}

export const StrictModeDroppable = ({
  children,
  ...props
}: StrictModeDroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable
      isDropDisabled={false}
      isCombineEnabled={false}
      ignoreContainerClipping={false}
      {...(props as any)}
    >
      {children as any}
    </Droppable>
  );
};
