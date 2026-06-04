// Public surface for the Horizon-1 research page. The page composes the
// sections below; everything ultimately reads its numbers from ./data.
export * from "./data";
export * from "./theme";
export * from "./figures";
export {
  Horizon1Chart,
  Horizon1ModelChart,
  Horizon1Results,
  Horizon1Table,
} from "./Results";
export {
  ContributorsSection,
  IntegritySection,
  IntroSection,
  MethodologySection,
  ResultsSection,
} from "./sections";
