interface Window {
  branch: {
    init: (key: string, callback?: (err: any, data?: any) => void) => void;
    link: (data: any, callback: (err: any, link?: string) => void) => void;
    [key: string]: any;
  };
} 