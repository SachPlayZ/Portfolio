export type DeviceType = 'mac' | 'windows' | 'mobile' | 'unknown';

export const detectDevice = (): DeviceType => {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();
  
  // Check for mobile devices first
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  if (isMobile) return 'mobile';
  
  // Check for Mac
  const isMac = /macintosh|mac os x/i.test(userAgent) || platform.includes('mac');
  if (isMac) return 'mac';
  
  // Check for Windows
  const isWindows = /win32|win64|windows|wince/i.test(userAgent) || platform.includes('win');
  if (isWindows) return 'windows';
  
  return 'unknown';
};

