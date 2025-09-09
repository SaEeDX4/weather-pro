import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY_DISMISSED = "instructorNoteDismissed";
const KEY_COLLAPSED = "instructorNoteCollapsed";

export default function InstructorNote({ initiallyOpen = true, children }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(KEY_DISMISSED) === "1";
    } catch {
      return false;
    }
  });
  const [open, setOpen] = useState(() => {
    try {
      if (localStorage.getItem(KEY_DISMISSED) === "1") return false;
      return localStorage.getItem(KEY_COLLAPSED) === "1"
        ? false
        : initiallyOpen;
    } catch {
      return initiallyOpen;
    }
  });
  const ref = useRef(null);

  useEffect(() => {
    if (open && !dismissed && ref.current) {
      setTimeout(
        () =>
          ref.current.scrollIntoView({ behavior: "smooth", block: "start" }),
        150
      );
    }
  }, [open, dismissed]);

  function collapse() {
    setOpen(false);
    try {
      localStorage.setItem(KEY_COLLAPSED, "1");
    } catch {}
  }
  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(KEY_DISMISSED, "1");
    } catch {}
  }

  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        <motion.div
          key="note"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div ref={ref} className="card" style={{ overflow: "hidden" }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div
                className="title"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span aria-hidden>⚑</span> Note to Instructor
              </div>
              <div className="row">
                <button
                  className="btn"
                  type="button"
                  onClick={() => (open ? collapse() : setOpen(true))}
                >
                  {open ? "Collapse" : "Expand"}
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={dismiss}
                  title="Hide and remember"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ paddingTop: 8 }}>{children}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
