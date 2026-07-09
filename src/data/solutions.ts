export interface Solution {
  slug: string;
  title: string;
  /** Short one-liner shown under the title on the solution page. */
  tagline: string;
  /** Lead paragraph(s) under the hero. Use `\n\n` to break into paragraphs. */
  overview: string;
  /** Bullet list of what the agent does, rendered as a checklist. */
  capabilities: string[];
  /** Small stat highlights shown in the hero. */
  metrics?: Array<{ value: string; label: string }>;
  /**
   * Long-form sections rendered in order. A `string[]` body renders as a
   * bullet list; a `string` body renders as paragraphs (split on `\n\n`).
   */
  sections: Array<{
    heading: string;
    body: string | string[];
  }>;
}

export const SOLUTIONS: Solution[] = [
  {
    slug: "field-data-capture",
    title: "Field Data Capture",
    tagline:
      "Turn photos, notes, and field forms into clean records in your system of record, automatically.",
    overview:
      "Crews generate a flood of unstructured field data every day: photos, voice notes, scribbled forms, and texts. Most of it never makes it into the system of record cleanly, or it lands there days late and full of gaps. Our agents capture that data the moment it's created and file it where it belongs.",
    capabilities: [
      "Parse field photos, PDFs, and voice notes into structured fields",
      "Match captures to the right site, asset, and work order",
      "Flag missing, blurry, or non-compliant captures back to the crew",
      "Write validated records straight into your system of record",
    ],
    metrics: [
      { value: "Same-day", label: "field-to-record turnaround" },
      { value: "100%", label: "captures matched to a work order" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Field data is born unstructured. A tech snaps twelve photos, jots a serial number, and moves to the next site. By the time anyone reconciles it against the system of record, context is lost, photos are unlabeled, and half the required fields are blank. Backfilling it is slow, manual, and error-prone.",
      },
      {
        heading: "What the agent does",
        body: [
          "Ingests captures from the field as they happen: photos, forms, messages, and voice notes.",
          "Reads each capture, extracts the relevant fields, and identifies the site, asset, and work order it belongs to.",
          "Checks every capture against your requirements and pushes back to the crew when something is missing or unusable.",
          "Writes clean, validated records into your system of record so the source of truth is always current.",
        ],
      },
      {
        heading: "What you get",
        body: "A live, auditable record of work in the field without anyone retyping it. Office teams stop chasing crews for missing photos, and your system of record reflects reality the same day work happens.",
      },
    ],
  },
  {
    slug: "close-out",
    title: "Close Out",
    tagline:
      "Assemble and submit closeout packets: photos, sign-offs, and as-builts, without the end-of-job scramble.",
    overview:
      "Closeout is where margin leaks. The work is done, but payment waits on a complete packet: inspection sign-offs, labeled photos, as-builts, and warranty docs, each formatted to a customer's spec. Our agents assemble that packet continuously so jobs close the day they finish.",
    capabilities: [
      "Collect closeout artifacts as work is completed, not at the end",
      "Format packets to each customer's exact submission spec",
      "Catch missing items before the packet is submitted",
      "Submit to portals on your approval, and track acceptance to completion",
    ],
    metrics: [
      { value: "Days → hours", label: "to a submitted packet" },
      { value: "Fewer", label: "rejections and resubmits" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Every customer wants a slightly different closeout packet, and the requirements live in a PDF nobody reads until the job is done. Teams reassemble photos and paperwork from scratch, discover gaps too late, and eat days of delay. Delayed closeout means delayed payment.",
      },
      {
        heading: "What the agent does",
        body: [
          "Tracks the closeout requirements for each job and customer.",
          "Gathers photos, inspection sign-offs, as-builts, and warranty documents as they're produced.",
          "Assembles the packet in the required format and flags anything missing while the crew is still on site.",
          "Submits to the customer or permitting portal on your sign-off, then follows the packet until it's accepted.",
        ],
      },
      {
        heading: "What you get",
        body: "Jobs that close on the day they finish, packets that pass on the first submission, and a closeout process that no longer holds your cash hostage.",
      },
    ],
  },
  {
    slug: "commissioning",
    title: "Commissioning (QC)",
    tagline:
      "Run commissioning checklists and quality control on every install, and catch issues before sign-off.",
    overview:
      "Commissioning is the last line of defense before an asset goes live, and it's only as good as the checklist someone actually completes. Our agents run the full commissioning and QC process on every install: verifying tests, reading results, and flagging defects before anyone signs off.",
    capabilities: [
      "Drive commissioning checklists step by step on every install",
      "Verify test results and torque, voltage, and label evidence",
      "Detect defects and rework items from field photos and data",
      "Produce a complete, auditable QC record per asset",
    ],
    metrics: [
      { value: "Every", label: "install commissioned to spec" },
      { value: "Earlier", label: "defect detection" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Commissioning quality varies by whoever is on site that day. Checklists get rubber-stamped, evidence is inconsistent, and defects surface after the asset is energized, when they're far more expensive to fix and harder to attribute.",
      },
      {
        heading: "What the agent does",
        body: [
          "Walks each install through its commissioning checklist and required tests.",
          "Reads submitted evidence such as photos, meter readings, and test exports, then verifies it against spec.",
          "Flags defects, missing steps, and out-of-tolerance results as rework before sign-off.",
          "Compiles a complete QC record for every asset, ready for audit or warranty.",
        ],
      },
      {
        heading: "What you get",
        body: "A consistent quality bar across every crew and site, defects caught before energization, and a defensible commissioning record for each asset you put in the ground.",
      },
    ],
  },
  {
    slug: "purchase-order",
    title: "Purchase Order",
    tagline:
      "Draft, route, and reconcile purchase orders with vendors, without the email back-and-forth.",
    overview:
      "POs are where projects stall. Material gets ordered late, quantities are wrong, and invoices don't match what arrived. Our agents own the purchase order lifecycle: drafting from the bill of materials, routing for approval, and reconciling against deliveries and invoices.",
    capabilities: [
      "Generate POs from the bill of materials and project schedule",
      "Route for approval and send to the right vendor",
      "Three-way match POs against deliveries and invoices",
      "Chase vendors on confirmations, ship dates, and discrepancies",
    ],
    metrics: [
      { value: "Faster", label: "PO turnaround" },
      { value: "Auto", label: "invoice reconciliation" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Purchasing runs on inbox threads and spreadsheets. Someone reads the BOM, emails a vendor, forgets to follow up, and the crew shows up to a site with no material. When invoices arrive, matching them to what was ordered and received is a manual slog.",
      },
      {
        heading: "What the agent does",
        body: [
          "Builds purchase orders from the bill of materials and the build schedule.",
          "Routes each PO for your approval, then issues it to the correct vendor.",
          "Follows up on order confirmations, ship dates, and backorders automatically.",
          "Performs a three-way match across PO, delivery, and invoice, and escalates only the true exceptions.",
        ],
      },
      {
        heading: "What you get",
        body: "Material on site when crews need it, vendors that stay on schedule because someone is always following up, and invoices that reconcile themselves instead of piling up on a desk.",
      },
    ],
  },
  {
    slug: "bidding",
    title: "Bidding",
    tagline:
      "Turn RFPs into accurate, on-time bids: takeoffs, pricing, and proposals assembled for you.",
    overview:
      "Winning work depends on bidding fast and bidding right, but every RFP is a research project. Our agents read the RFP, do the takeoff, price the job against your cost data, and assemble a proposal, so you bid more jobs without growing the estimating team.",
    capabilities: [
      "Read RFPs and extract scope, specs, and submission requirements",
      "Perform quantity takeoffs from plans and drawings",
      "Price the job against your historical cost and vendor data",
      "Assemble a formatted, submission-ready proposal",
    ],
    metrics: [
      { value: "More", label: "bids submitted per estimator" },
      { value: "Hours", label: "not days, per bid" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Estimating is the bottleneck on growth. Each RFP demands hours of reading, takeoff, and pricing, so teams cherry-pick which jobs to bid and leave winnable work on the table. Rushed bids carry errors that erase the margin you won.",
      },
      {
        heading: "What the agent does",
        body: [
          "Parses the RFP for scope, specifications, deadlines, and submission rules.",
          "Performs quantity takeoffs from the plan set and drawings.",
          "Prices labor and material against your historical costs and current vendor quotes.",
          "Drafts the proposal in the required format, ready for an estimator to review and send.",
        ],
      },
      {
        heading: "What you get",
        body: "More bids out the door with the same team, pricing grounded in your own cost history, and estimators spending their time on judgment instead of data entry.",
      },
    ],
  },
  {
    slug: "permitting",
    title: "Permitting",
    tagline:
      "Prepare, submit, and track permits across jurisdictions, and keep projects out of permit limbo.",
    overview:
      "Permitting is a maze of jurisdiction-specific forms, portals, and review cycles, and a single missed correction can stall a project for weeks. Our agents prepare permit applications to each jurisdiction's requirements, submit them, and stay on top of every review until approval.",
    capabilities: [
      "Assemble applications to each jurisdiction's specific requirements",
      "Prepare submissions for the right portal or channel per AHJ",
      "Track review status and respond to correction notices",
      "Maintain a live view of permit status across every project",
    ],
    metrics: [
      { value: "Every", label: "AHJ's requirements handled" },
      { value: "Zero", label: "applications lost in a portal" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Every authority having jurisdiction wants something different, on a different portal, in a different format. Applications bounce back for trivial corrections, reviews drag on without anyone watching, and projects sit in permit limbo while the calendar burns.",
      },
      {
        heading: "What the agent does",
        body: [
          "Determines the permits and documents each jurisdiction requires for the project.",
          "Assembles complete applications and submits them through the correct channel once your team signs off.",
          "Monitors review status and turns correction notices around quickly.",
          "Keeps a real-time view of where every permit stands across all active projects.",
        ],
      },
      {
        heading: "What you get",
        body: "Applications that are right the first time, corrections handled before they delay the schedule, and a single, current picture of permit status across your entire pipeline.",
      },
    ],
  },
];

export function getSolutionBySlug(slug: string | undefined): Solution | undefined {
  if (!slug) return undefined;
  return SOLUTIONS.find((solution) => solution.slug === slug);
}
