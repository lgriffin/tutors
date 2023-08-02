import { page } from '$app/stores';
import { analyticsService } from '$lib/services/analytics';
import { get } from 'svelte/store';
import { transitionKey, currentCourse } from '$lib/stores';
import { presenceService } from '$lib/services/presence';
import { initFirebase } from '$lib/utils/firebase';
import { getKeys } from '$lib/environment';
import { goto } from '$app/navigation';
import type { Token } from '$lib/types/auth';

export async function initServices(session: Token) {
	if (getKeys().firebase.apiKey !== 'XXX') {
		initFirebase(getKeys().firebase);
		presenceService.startPresenceEngine(session);
		const pageVal = get(page);
		if (pageVal.url.hash) {
			if (pageVal.url.hash.startsWith('#/course')) {
				goto(pageVal.url.hash.slice(2));
			}
		} else {
			if (get(currentCourse)) {
				const course = get(currentCourse);
				if (session) {
					session.onlineStatus = await analyticsService.getOnlineStatus(course, session);
					analyticsService.updateLogin(course.id, session);
				}
			}
		}
	}

	page.subscribe((path) => {
		if (path.url.hash.startsWith('#/course')) {
			const relPath = path.url.hash.slice(1);
			goto(relPath);
		}
		transitionKey.set(path.url.pathname);
		if (
			path.url.pathname.includes('book') ||
			path.url.pathname.includes('pdf') ||
			path.url.pathname.includes('video') ||
			path.url.pathname.includes('note')
		) {
			transitionKey.set('none');
		}
	});
}
