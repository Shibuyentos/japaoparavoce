import { getDashboard } from '#lib/server/dashboard.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { dashboard: await getDashboard() };
};
