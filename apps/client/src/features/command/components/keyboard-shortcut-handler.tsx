import { useEffect } from "react";
import { useCommandStore } from "../stores/command-store";

// Map key names to their event.key values
const keyMap: Record<string, string> = {
  Cmd: "Meta",
  Ctrl: "Control",
  Alt: "Alt",
  Shift: "Shift",
  Enter: "Enter",
  Space: " ",
  Backspace: "Backspace",
  Delete: "Delete",
  Escape: "Escape",
  Tab: "Tab",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  // Add more mappings as needed
};

export function KeyboardShortcutHandler() {
  const { actions, executeCommand } = useCommandStore();

  useEffect(() => {
    // Create a map of shortcuts to command IDs
    const shortcutMap = new Map<string, string>();

    // biome-ignore lint/complexity/noForEach: <explanation>
    actions.forEach((action) => {
      if (action.shortcut && action.shortcut.length > 0) {
        // Create a normalized key combination
        const normalizedShortcut = action.shortcut
          .map((key) => keyMap[key] || key.toUpperCase())
          .sort() // Sort to ensure consistent order
          .join("+");

        shortcutMap.set(normalizedShortcut, action.id);
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs or textareas
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Create a sorted set of pressed modifier keys
      const pressedKeys: string[] = [];

      if (e.metaKey) pressedKeys.push("Meta");
      if (e.ctrlKey) pressedKeys.push("Control");
      if (e.altKey) pressedKeys.push("Alt");
      if (e.shiftKey) pressedKeys.push("Shift");

      // Add the main key (if it's not a modifier)
      if (
        e.key !== "Meta" &&
        e.key !== "Control" &&
        e.key !== "Alt" &&
        e.key !== "Shift"
      ) {
        // For letters, we need to uppercase to match our map
        if (e.key.length === 1) {
          pressedKeys.push(e.key.toUpperCase());
        } else {
          pressedKeys.push(e.key);
        }
      }

      // Create a normalized key combination to look up
      const keyCombo = pressedKeys.sort().join("+");

      const commandId = shortcutMap.get(keyCombo);
      if (commandId) {
        e.preventDefault();
        executeCommand(commandId);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [actions, executeCommand]);

  return null; // This component doesn't render anything
}
