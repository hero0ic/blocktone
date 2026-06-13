"use client";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: HelpModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="game-panel animate-fade-in max-h-[85vh] w-full max-w-lg overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="help-title"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="help-title" className="font-minecraft text-2xl text-foreground">
            Help
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="utility-btn shrink-0"
            aria-label="Close help"
          >
            ✕
          </button>
        </div>

        <section className="mt-6">
          <h3 className="font-minecraft text-sm text-accent">How To Play</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 font-body text-sm leading-relaxed text-muted">
            <li>Each game consists of 5 rounds.</li>
            <li>Adjust Hue, Saturation, and Brightness.</li>
            <li>Restore each texture to its original appearance.</li>
            <li>Submit your answer.</li>
            <li>Earn the highest score possible across all rounds.</li>
          </ol>
        </section>

        <section className="mt-6">
          <h3 className="font-minecraft text-sm text-accent">Credits</h3>
          <p className="mt-2 font-body text-sm text-muted">
            Minecraft textures sourced from{" "}
            <a
              href="https://mcasset.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2 hover:text-accent"
            >
              mcasset.cloud
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
