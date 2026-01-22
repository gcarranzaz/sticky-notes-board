export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export interface Rect {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

export interface Bounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export const isPointInRect = (x: number, y: number, rect: Rect): boolean =>
  x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

export const isPointInElement = (x: number, y: number, element: HTMLElement | null): boolean => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return isPointInRect(x, y, rect);
};

export const constrainToBounds = (
  x: number,
  y: number,
  width: number,
  height: number,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number } => ({
  x: clamp(x, 0, containerWidth - width),
  y: clamp(y, 0, containerHeight - height),
});

type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

export const calculateResize = (
  startWidth: number,
  startHeight: number,
  startX: number,
  startY: number,
  deltaX: number,
  deltaY: number,
  handle: ResizeHandle,
  minWidth: number,
  minHeight: number
): Bounds => {
  let width = startWidth;
  let height = startHeight;
  let x = startX;
  let y = startY;

  if (handle.includes('e')) {
    width = Math.max(minWidth, startWidth + deltaX);
  } else if (handle.includes('w')) {
    const newWidth = Math.max(minWidth, startWidth - deltaX);
    x = startX + (startWidth - newWidth);
    width = newWidth;
  }

  if (handle.includes('s')) {
    height = Math.max(minHeight, startHeight + deltaY);
  } else if (handle.includes('n')) {
    const newHeight = Math.max(minHeight, startHeight - deltaY);
    y = startY + (startHeight - newHeight);
    height = newHeight;
  }

  return { width, height, x, y };
};

export const doRectsOverlap = (rect1: Bounds, rect2: Bounds): boolean =>
  !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );

export const getRectCenter = (
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } => ({
  x: x + width / 2,
  y: y + height / 2,
});
