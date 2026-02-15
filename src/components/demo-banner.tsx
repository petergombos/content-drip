export function DemoBanner() {
  return (
    <div className="border-b border-[#1a1a1a] bg-[#050505] px-6 py-2.5 text-center">
      <p className="text-sm text-[#e8e8e8]/70">
        This is a <strong className="text-[#e8e8e8]">live demo</strong> of a
        ContentDrip content pack.{" "}
        <a
          href="/"
          className="font-medium text-[#c8ff00] hover:underline"
        >
          Learn more about ContentDrip &rarr;
        </a>
      </p>
    </div>
  );
}
