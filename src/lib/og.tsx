/* eslint-disable @next/next/no-img-element */

const dmSansRegular = fetch(
  new URL("../../public/fonts/DMSans-Regular.ttf", import.meta.url)
).then((r) => r.arrayBuffer());

const dmSansBold = fetch(
  new URL("../../public/fonts/DMSans-Bold.ttf", import.meta.url)
).then((r) => r.arrayBuffer());

const fraunceSemiBold = fetch(
  new URL("../../public/fonts/Fraunces-SemiBold.ttf", import.meta.url)
).then((r) => r.arrayBuffer());

export async function loadFonts() {
  const [regular, bold, fraunces] = await Promise.all([
    dmSansRegular,
    dmSansBold,
    fraunceSemiBold,
  ]);

  return [
    { name: "DM Sans", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "DM Sans", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const },
  ];
}

export function DarkTemplate({
  title,
  description,
  label,
}: {
  title: string;
  description?: string;
  label?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#050505",
        fontFamily: "DM Sans",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Large chartreuse accent shape — top right */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          backgroundColor: "#c8ff00",
          opacity: 0.07,
        }}
      />
      {/* Smaller offset circle */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "30px",
          right: "30px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          border: "1.5px solid #c8ff00",
          opacity: 0.2,
        }}
      />

      {/* Vertical accent line */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: "120px",
          top: "0",
          width: "1px",
          height: "100%",
          background:
            "linear-gradient(180deg, transparent 0%, #c8ff00 30%, #c8ff00 70%, transparent 100%)",
          opacity: 0.08,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "56px 64px",
          position: "relative",
        }}
      >
        {/* Top: logo + label */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Droplet mark */}
            <div
              style={{
                display: "flex",
                width: "28px",
                height: "28px",
                backgroundColor: "#c8ff00",
                borderRadius: "50% 50% 50% 4px",
                transform: "rotate(-45deg)",
              }}
            />
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#e8e8e8",
                letterSpacing: "-0.02em",
              }}
            >
              ContentDrip
            </div>
          </div>
          {label && (
            <div
              style={{
                display: "flex",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#c8ff00",
                border: "1px solid rgba(200,255,0,0.35)",
                padding: "8px 16px",
              }}
            >
              {label}
            </div>
          )}
        </div>

        {/* Title + description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "880px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 50 ? 50 : 64,
              fontWeight: 700,
              color: "#e8e8e8",
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 22,
                color: "#666",
                lineHeight: 1.45,
              }}
            >
              {description.length > 120
                ? description.slice(0, 117) + "..."
                : description}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              width: "48px",
              height: "4px",
              backgroundColor: "#c8ff00",
            }}
          />
          <div
            style={{
              display: "flex",
              width: "8px",
              height: "4px",
              backgroundColor: "#c8ff00",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              display: "flex",
              width: "4px",
              height: "4px",
              backgroundColor: "#c8ff00",
              opacity: 0.2,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function WarmTemplate({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(150deg, #faf7f2 0%, #f3ece1 50%, #e8ddd0 100%)",
        fontFamily: "DM Sans",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Large decorative circle — bottom right */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: "-120px",
          right: "-60px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "1.5px solid #c4a97d",
          opacity: 0.2,
        }}
      />
      {/* Smaller nested circle */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: "-40px",
          right: "20px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          border: "1px solid #c4a97d",
          opacity: 0.12,
        }}
      />

      {/* Horizontal accent line */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: "0",
          bottom: "160px",
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, #c4a97d 20%, #c4a97d 80%, transparent 100%)",
          opacity: 0.1,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "56px 68px",
          position: "relative",
        }}
      >
        {/* Top: Learnwise badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              backgroundColor: "#2a2520",
              color: "#faf7f2",
              fontSize: 19,
              fontWeight: 700,
              borderRadius: "6px",
            }}
          >
            L
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#8a7d6d",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Learnwise
          </div>
        </div>

        {/* Title + description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "820px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 40 ? 50 : 60,
              fontWeight: 600,
              color: "#2a2520",
              lineHeight: 1.12,
              fontFamily: "Fraunces",
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 22,
                color: "#8a7d6d",
                lineHeight: 1.45,
              }}
            >
              {description.length > 120
                ? description.slice(0, 117) + "..."
                : description}
            </div>
          )}
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              width: "48px",
              height: "3px",
              backgroundColor: "#c4a97d",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#b09a80",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Free Email Course
          </div>
        </div>
      </div>
    </div>
  );
}
