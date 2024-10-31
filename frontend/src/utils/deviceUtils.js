export const isIOS = () => {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
};

export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

export const isMobile = () => {
  return isIOS() || isAndroid();
}; 