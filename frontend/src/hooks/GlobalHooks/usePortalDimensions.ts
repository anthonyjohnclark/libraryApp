import { useState } from "react";

const usePortalDimensions = (topRef?: any, bottomRef?: any) => {
  const [topHeight, setTopHeight] = useState<number>();

  const [bottomHeight, setBottomHeight] = useState<number>();

  const getTopSize = () => {
    if (topRef.current) {
      const newHeight = topRef.current["clientHeight"];
      setTopHeight(newHeight);
    } else return;
  };

  const getBottomSize = () => {
    if (bottomRef.current) {
      const newHeight = bottomRef.current["clientHeight"];
      setBottomHeight(newHeight);
    } else return;
  };

  return {
    topHeight,
    bottomHeight,
    getTopSize,
    getBottomSize,
  };
};

export default usePortalDimensions;
