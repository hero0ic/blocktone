import { SITE_NAME } from "@/lib/site";

export const SOCIAL_IMAGE_TAGLINE =
  "A daily Minecraft color guessing game.";

/** Shared 1200×630 social preview — BlockTone title, tagline, URL. */
export function SocialPreviewImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#111111",
        fontFamily: "Minecraft",
        padding: "72px 64px",
      }}
    >
      <div style={{ flex: 1 }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 96,
            color: "#f2f2f2",
            lineHeight: 1.1,
            marginBottom: 28,
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            fontSize: 36,
            color: "rgba(242, 242, 242, 0.72)",
            lineHeight: 1.3,
            maxWidth: 900,
          }}
        >
          {SOCIAL_IMAGE_TAGLINE}
        </div>
      </div>

      <div
        style={{
          fontSize: 24,
          color: "rgba(242, 242, 242, 0.45)",
          lineHeight: 1,
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

export const SOCIAL_IMAGE_ALT = `${SITE_NAME} — ${SOCIAL_IMAGE_TAGLINE}`;
