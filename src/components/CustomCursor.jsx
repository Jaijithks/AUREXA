import { useCustomCursor } from '../hooks/useCustomCursor';

export default function CustomCursor() {
  const { dotRef, ringRef } = useCustomCursor();

  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
    </>
  );
}
