import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Vaulté — Where wealth is kept.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadGoogleFont(fontFamily: string, weight: number, style: "normal" | "italic") {
  const italicParam = style === "italic" ? "1" : "0";
  const params = new URLSearchParams({
    family: `${fontFamily}:ital,wght@${italicParam},${weight}`,
    display: "swap",
  });
  const css = await fetch(
    `https://fonts.googleapis.com/css2?${params.toString()}`,
    { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36" } }
  ).then((r) => r.text());

  const fontUrl = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error(`Could not load font: ${fontFamily}`);

  return fetch(fontUrl).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const [interRegular, interMedium, playfairRegular, playfairItalic] = await Promise.all([
    loadGoogleFont("Inter", 400, "normal"),
    loadGoogleFont("Inter", 500, "normal"),
    loadGoogleFont("Playfair Display", 400, "normal"),
    loadGoogleFont("Playfair Display", 400, "italic"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0B",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201, 168, 76, 0.06) 0%, transparent 70%)",
          }}
        />

        {/* Vault icon */}
        <svg
          width="80"
          height="64"
          viewBox="0 0 48 48"
          fill="none"
          style={{ marginBottom: "24px" }}
        >
          <rect
            x="4"
            y="8"
            width="40"
            height="32"
            rx="5"
            stroke="#C9A84C"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r="8"
            stroke="#C9A84C"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="24" cy="24" r="2.5" fill="#C9A84C" />
          <rect x="22.5" y="24" width="3" height="5" rx="1" fill="#C9A84C" />
          <rect x="8" y="12" width="10" height="4" rx="1" fill="#C9A84C" opacity="0.4" />
        </svg>

        {/* Headline */}
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "64px",
            fontWeight: 400,
            color: "#F5F0E8",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Where wealth
        </div>
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "72px",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#C9A84C",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          is kept.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            fontWeight: 400,
            color: "#8A8680",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          Private banking built for the modern era
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "1px",
              background: "rgba(201, 168, 76, 0.3)",
            }}
          />
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#4A4643",
              letterSpacing: "4px",
            }}
          >
            VAULTÉ
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interMedium,
          weight: 500,
          style: "normal",
        },
        {
          name: "Playfair Display",
          data: playfairRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Playfair Display",
          data: playfairItalic,
          weight: 400,
          style: "italic",
        },
      ],
    }
  );
}
