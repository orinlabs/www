import {
  BatteryCharging,
  FileCheck2,
  Gavel,
  type LucideIcon,
} from 'lucide-react';
import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Deployment {
  id: string;
  industry: string;
  icon: LucideIcon;
  title: string;
  collapsedTitle: string;
  collapsedTitleClass: string;
  summary: string;
  image: string;
  imagePosition: string;
}

const DEPLOYMENTS: Deployment[] = [
  {
    id: 'ev',
    industry: 'EV Chargers',
    icon: BatteryCharging,
    title: 'L2 chargers built at scale',
    collapsedTitle: 'Chargers',
    collapsedTitleClass: 'tracking-[-0.01em]',
    summary:
      'Purchase orders, subcontractors, and data entry run by autonomous agents.',
    image: 'https://transportation.stanford.edu/sites/g/files/sbiybj27281/files/styles/responsive_large/public/media/image/ev_charging_ehs_0.jpg?itok=438strui',
    imagePosition: 'center',
  },
  {
    id: 'epc',
    industry: 'Solar EPC',
    icon: FileCheck2,
    title: 'Autonomous solar build-outs',
    collapsedTitle: 'Solar',
    collapsedTitleClass: 'tracking-[-0.01em]',
    summary:
      'Permits, sites, and commissioning run by autonomous agents.',
    image: 'https://coldwellenergy.com/wp-content/uploads/2022/03/solar-panels-on-commercial-building.jpg',
    imagePosition: 'center',
  },
  {
    id: 'gc',
    industry: 'General contracting',
    icon: Gavel,
    title: 'Bid-out cycles',
    collapsedTitle: 'Bids',
    collapsedTitleClass: 'tracking-[-0.01em]',
    summary:
      'Scopes, vendor follow-ups, and quote comparisons handled cleanly.',
    image: '/project-backgrounds/permitting.jpg',
    imagePosition: 'center',
  },
];

function DeploymentBadge({
  icon: Icon,
  label,
  isActive,
}: {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}) {
  return (
    <span
      className={
        'inline-flex h-9 items-center overflow-hidden rounded-full border border-white/25 bg-black/35 text-white/90 backdrop-blur transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
        (isActive ? 'max-w-56' : 'max-w-9')
      }
      aria-label={label}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <Icon className="h-3.5 w-3.5" />
      </span>
      
      <span
        className={
          'whitespace-nowrap pr-3 text-xs font-medium transition-[max-width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
          (isActive ? 'max-w-40 opacity-100' : 'max-w-0 opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}

function DeploymentPanel({
  deployment,
  isActive,
  isCollapsedLabelExiting,
  imageWidth,
  imageHeight,
  imageOffset,
  imageTransition,
  collapsedWidth,
  labelAnchorRight,
  onActivate,
}: {
  deployment: Deployment;
  isActive: boolean;
  isCollapsedLabelExiting: boolean;
  imageWidth: number;
  imageHeight: number;
  imageOffset: number;
  imageTransition: boolean;
  collapsedWidth: number;
  labelAnchorRight: boolean;
  onActivate: () => void;
}) {
  const measured = imageWidth > 0 && imageHeight > 0;

  // Anchor the collapsed vertical title to the card edge that stays fixed while
  // this card collapses (the edge away from the newly-opened card), then center
  // it within the collapsed-column width so it doesn't get dragged across the
  // page during the width animation.
  const labelInset = collapsedWidth > 0 ? collapsedWidth / 2 : 0;
  const titleLabelInset =
    labelInset > 0
      ? labelInset + (labelAnchorRight ? -COLLAPSED_TITLE_NUDGE : COLLAPSED_TITLE_NUDGE)
      : 0;
  const labelAnchorClass =
    labelInset > 0
      ? labelAnchorRight
        ? 'right-[var(--label-inset)] translate-x-1/2'
        : 'left-[var(--label-inset)] -translate-x-1/2'
      : 'left-1/2 -translate-x-1/2';

  return (
    <article
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      style={
        labelInset > 0
          ? ({ '--label-inset': labelInset + 'px' } as CSSProperties)
          : undefined
      }
      className={
        'orin-deploy-panel group relative isolate h-full min-h-[26rem] min-w-0 cursor-pointer overflow-hidden rounded-[1.75rem] text-white outline-none transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-primary-400 md:min-h-[34rem] xl:min-h-0 ' +
        (isActive ? 'is-active' : '')
      }
    >
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit] bg-neutral-950">
        <div
          className={
            'absolute left-0 top-0 bg-cover bg-no-repeat ' +
            (imageTransition
              ? 'transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
              : '')
          }
          style={{
            width: measured ? imageWidth + 'px' : '100%',
            height: measured ? imageHeight + 'px' : '100%',
            transform: 'translateX(' + -imageOffset + 'px)',
            backgroundImage: measured ? 'url(' + deployment.image + ')' : 'none',
            backgroundPosition: deployment.imagePosition,
          }}
        />
        <div
          className={
            'absolute inset-0 transition-colors duration-500 ' +
            (isActive
              ? 'bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.88)_100%)]'
              : 'bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.66)_50%,rgba(0,0,0,0.94)_100%)]')
          }
        />
      </div>

      <div
        className={
          'absolute top-6 z-10 flex items-center md:top-8 ' +
          (isActive ? 'inset-x-6 md:inset-x-8' : labelAnchorClass)
        }
      >
        <DeploymentBadge
          icon={deployment.icon}
          label={deployment.industry}
          isActive={isActive}
        />
      </div>

      <div
        className={
          'absolute bottom-6 z-10 md:bottom-8 ' +
          labelAnchorClass +
          (isActive || isCollapsedLabelExiting ? ' pointer-events-none' : '')
        }
        style={
          titleLabelInset > 0
            ? ({ '--label-inset': titleLabelInset + 'px' } as CSSProperties)
            : undefined
        }
      >
        <div
          className={
            'transition-[opacity,transform] duration-150 ease-out ' +
            (isActive || isCollapsedLabelExiting
              ? 'translate-y-1 opacity-0'
              : 'translate-y-0 opacity-100 delay-[280ms]')
          }
        >
          <h3
            className={
              "[writing-mode:vertical-rl] rotate-180 whitespace-nowrap !font-['Body'] text-5xl font-semibold leading-none drop-shadow md:text-6xl lg:text-7xl " +
              deployment.collapsedTitleClass
            }
          >
            {deployment.collapsedTitle}
          </h3>
        </div>
      </div>

      <div className="absolute inset-0 z-10 grid p-6 md:p-8">
        <div
          className={
            'col-start-1 row-start-1 w-[36rem] max-w-[calc(100vw-3rem)] self-end transition-[opacity,transform] duration-500 ' +
            (isActive
              ? 'delay-150 translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-1 opacity-0 delay-0')
          }
        >
          <h3 className="max-w-xl whitespace-nowrap !font-['Body'] text-3xl font-semibold leading-[1.04] drop-shadow md:text-5xl">
            {deployment.title}
          </h3>
          <p className="mt-4 text-base leading-7 text-white/85 drop-shadow">
            {deployment.summary}
          </p>
        </div>
      </div>
    </article>
  );
}

const GALLERY_GAP = 12;
const ACTIVE_FR = 8;
const COLLAPSED_FR = 1;
const COLLAPSED_TITLE_NUDGE = -1;

export function DeploymentsGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingCollapsedIndex, setExitingCollapsedIndex] = useState<number | null>(null);
  const activationTimeoutRef = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [imageTransition, setImageTransition] = useState(false);
  const deploymentColumns = DEPLOYMENTS
    .map((_, index) => (index === activeIndex ? '8fr' : '1fr'))
    .join(' ');

  useEffect(() => {
    return () => {
      if (activationTimeoutRef.current !== null) {
        window.clearTimeout(activationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) {
      return;
    }

    const update = () => {
      setGridWidth(grid.clientWidth);
      setGridHeight(grid.clientHeight);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(grid);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsHorizontal(query.matches);
    update();

    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Enable the image transform transition only after the first correct
  // measurement has painted, so images don't slide in on initial mount.
  useEffect(() => {
    if (gridWidth === 0) {
      return;
    }

    const frame = window.requestAnimationFrame(() => setImageTransition(true));
    return () => window.cancelAnimationFrame(frame);
  }, [gridWidth, isHorizontal]);

  function imagePlacement(index: number): { width: number; offset: number } {
    if (!isHorizontal || gridWidth === 0) {
      return { width: gridWidth, offset: 0 };
    }

    const count = DEPLOYMENTS.length;
    const tracksWidth = gridWidth - GALLERY_GAP * (count - 1);
    const totalFr = ACTIVE_FR + (count - 1) * COLLAPSED_FR;
    const widthFor = (i: number) =>
      ((i === activeIndex ? ACTIVE_FR : COLLAPSED_FR) / totalFr) * tracksWidth;

    let offset = 0;
    for (let i = 0; i < index; i += 1) {
      offset += widthFor(i) + GALLERY_GAP;
    }

    return { width: gridWidth, offset };
  }

  function collapsedColumnWidth(): number {
    if (!isHorizontal || gridWidth === 0) {
      return gridWidth;
    }

    const count = DEPLOYMENTS.length;
    const tracksWidth = gridWidth - GALLERY_GAP * (count - 1);
    const totalFr = ACTIVE_FR + (count - 1) * COLLAPSED_FR;
    return (COLLAPSED_FR / totalFr) * tracksWidth;
  }

  const collapsedWidth = collapsedColumnWidth();

  function activateDeployment(index: number) {
    if (index === activeIndex) {
      return;
    }

    if (activationTimeoutRef.current !== null) {
      window.clearTimeout(activationTimeoutRef.current);
    }

    setExitingCollapsedIndex(index);
    activationTimeoutRef.current = window.setTimeout(() => {
      setActiveIndex(index);
      setExitingCollapsedIndex(null);
      activationTimeoutRef.current = null;
    }, 110);
  }

  return (
    <section className="relative" id="deployments">
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-3 transition-[grid-template-columns] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:[grid-template-columns:var(--deployment-columns)] xl:h-[70vh]"
        style={{ '--deployment-columns': deploymentColumns } as CSSProperties}
      >
        {DEPLOYMENTS.map((deployment, index) => {
          const placement = imagePlacement(index);

          return (
            <DeploymentPanel
              key={deployment.id}
              deployment={deployment}
              isActive={index === activeIndex}
              isCollapsedLabelExiting={index === exitingCollapsedIndex}
              imageWidth={placement.width}
              imageHeight={gridHeight}
              imageOffset={placement.offset}
              imageTransition={imageTransition}
              collapsedWidth={collapsedWidth}
              labelAnchorRight={isHorizontal && activeIndex < index}
              onActivate={() => activateDeployment(index)}
            />
          );
        })}
      </div>
    </section>
  );
}
