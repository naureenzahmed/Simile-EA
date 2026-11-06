import { getData } from '../store.js';
import { renderTrackerPage } from './trackerShared.js';

export const RECRUITMENT_TITLE = 'Special Project: Talent Pipeline';

export function renderRecruitment(container) {
  renderTrackerPage(container, getData(), 'recruitment', { title: RECRUITMENT_TITLE });
}
