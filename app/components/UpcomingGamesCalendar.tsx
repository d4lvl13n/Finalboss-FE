import { getUpcomingGames } from '../lib/igdb-server';
import UpcomingGamesCalendarClient from './UpcomingGamesCalendarClient';

interface UpcomingGamesCalendarProps {
  limit?: number;
  compact?: boolean;
  title?: string;
  description?: string;
  href?: string;
}

export default async function UpcomingGamesCalendar({
  limit = 12,
  compact = false,
  title = 'Releasing Soon',
  description = 'Track the next wave of launches from IGDB without digging through the full catalog.',
  href = '/games',
}: UpcomingGamesCalendarProps) {
  const games = await getUpcomingGames(limit);

  return (
    <UpcomingGamesCalendarClient
      games={games}
      compact={compact}
      title={title}
      description={description}
      href={href}
    />
  );
}
