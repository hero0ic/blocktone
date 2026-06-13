import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/** Shared 1200×630 social preview artwork for Open Graph and Twitter. */
export function SocialPreviewImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111111",
        backgroundImage:
          "radial-gradient(ellipse at 50% 28%, rgba(92, 219, 92, 0.14) 0%, transparent 58%)",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 120,
          height: 120,
          borderRadius: 9999,
          border: "4px solid rgba(255, 255, 255, 0.12)",
          background: "rgba(0, 0, 0, 0.55)",
          marginBottom: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 9999,
            background: "#5cdb5c",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              marginLeft: 8,
              borderTop: "18px solid transparent",
              borderBottom: "18px solid transparent",
              borderLeft: "30px solid #111111",
            }}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: 88,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#f2f2f2",
          lineHeight: 1,
          marginBottom: 20,
        }}
      >
        {SITE_NAME}
      </div>

      <div
        style={{
          fontSize: 34,
          fontWeight: 500,
          color: "rgba(242, 242, 242, 0.72)",
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.35,
          marginBottom: 28,
        }}
      >
        {SITE_DESCRIPTION}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#5cdb5c",
          letterSpacing: "0.04em",
        }}
      >
        blocktone.app
      </div>
    </div>
  );
}

export const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const SOCIAL_IMAGE_ALT = `${SITE_NAME} — Restore distorted Minecraft textures`;
