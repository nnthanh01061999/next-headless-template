import { HydrationContext } from "@/contexts/HydrationProvider";
import { useState, useEffect, useContext } from "react";

function getInitialDeviceType(userAgent: string) {
  const isMobile = /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad/i.test(userAgent);
  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  };
}

function getDeviceType() {
  const { innerWidth } = window;
  const isMobile = innerWidth < 360;
  const isTablet = innerWidth <= 768;
  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  };
}

export const useDeviceType = () => {
  const { userAgent } = useContext(HydrationContext);
  const [deviceType, setDeviceType] = useState(getInitialDeviceType(userAgent));

  useEffect(() => {
    function handleResize() {
      setDeviceType(getDeviceType());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceType;
};
