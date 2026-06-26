import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center py-24 sm:py-32">
      <p className="font-mono text-sm tracking-widest text-primary mb-4">404</p>
      <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
        Page not found
      </h1>
      <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-md mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary text-anti-primary px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back home
      </Link>
    </div>
  );
}
