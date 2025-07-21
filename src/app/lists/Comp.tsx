import { useTour } from "@reactour/tour";
export default function Comp({}: {}) {
  const steps = [
    {
      selector: ".first-step",
      content: "This is my first Step",
    },
  ];

  const { setIsOpen } = useTour();
  return (
    <>
      <p className="first-step">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at
        finibus nulla, quis varius justo. Vestibulum lorem lorem, viverra porta
        metus nec, porta luctus orci
      </p>
      <button onClick={() => setIsOpen(true)}>Open Tour</button>
    </>
  );
}
