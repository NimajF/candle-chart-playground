export function BrandLogo({ size = 24 }: { size?: number }) {
  return (
    <img
      src="/apple-touch-icon.png"
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full"
    />
  );
}
