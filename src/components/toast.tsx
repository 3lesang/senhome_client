import { useEffect, useState } from "react";

import type { ReactNode } from "react";

type ToastData = {
  id: number;
  node: ReactNode;
};

let currentToast: ToastData | null = null;
let listeners: ((toast: ToastData | null) => void)[] = [];

export const toast = (node: ReactNode, duration = 3000) => {
  const id = Date.now();
  currentToast = { id, node };
  update();

  setTimeout(() => {
    currentToast = null;
    update();
  }, duration);
};

function update() {
  listeners.forEach((cb) => cb(currentToast));
}

export function subscribe(cb: (toast: ToastData | null) => void) {
  listeners.push(cb);
  cb(currentToast);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function Toaster() {
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    const unsub = subscribe(setToast);
    return unsub;
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div>{toast.node}</div>
    </div>
  );
}

export default Toaster;
