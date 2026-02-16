import { driver } from "driver.js";
import { useGridStore } from "@/store/useGridStore";
import { exampleJson } from "@/data/example";

const TOUR_DONE_KEY = "tour-done";

function createDriver() {
  return driver({
    showProgress: true,
    allowClose: true,
    overlayOpacity: 0.35,
    popoverClass: "driver-popover-irrigation",
    steps: [
      {
        popover: {
          title: "Welcome to Irrigation Builder!",
          description: "This short tour will show you the basics.",
          side: "over",
          align: "center",
        },
      },
      {
        element: "[data-tour=\"load-example\"]",
        popover: {
          title: "Load example",
          description: "To start, click the Load example button.",
          side: "bottom",
          align: "center",
          onNextClick: (_element, _step, opts) => {
            useGridStore.getState().loadFromJson(exampleJson);
            requestAnimationFrame(() => opts.driver.moveNext());
          },
        },
      },
      {
        element: () =>
          document.querySelector("[data-tour=\"example-tap\"]") as Element,
        popover: {
          title: "Tap",
          description: "Here you will see a tap. A tap is often used to indicate the start of your irrigation plan.",
          side: "right",
          align: "center",
        },
      },
      {
        element: "[data-tour=\"place-pipe\"]",
        popover: {
          title: "Place components on grid",
          description: "Piping and other irrigation components are placed by clicking on the icons in the task bar, and then clicking on the grid.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "[data-tour=\"save\"]",
        popover: {
          title: "Save",
          description: "Use the Save button to save your diagram.",
          side: "bottom",
          align: "center",
        },
      },
    ],
    onDestroyed: () => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOUR_DONE_KEY, "1");
      }
    },
  });
}

let driverInstance: ReturnType<typeof driver> | null = null;

function getDriver() {
  if (!driverInstance) {
    driverInstance = createDriver();
  }
  return driverInstance;
}

export function startTour(): void {
  getDriver().drive();
}

export function runTourIfFirstTime(): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(TOUR_DONE_KEY)) return;
  requestAnimationFrame(() => {
    setTimeout(() => getDriver().drive(), 300);
  });
}
