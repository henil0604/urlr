'use client';

import { LocalStorageKeyName } from '@/const';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface EngagementGraphDataEntity {
	timestamp: Date;
	name: string;
}
interface OverallEngagementGraphDataStore {
	data: EngagementGraphDataEntity[];
	add: (
		entity: EngagementGraphDataEntity | EngagementGraphDataEntity[],
	) => any;
	reset: () => any;
}
export const useOverallEngagementGraphDataStore =
	create<OverallEngagementGraphDataStore>((set) => {
		return {
			data: [],
			add: (entity) => {
				set((state) => {
					const newEntities = Array.isArray(entity)
						? entity
						: [entity];
					return {
						data: [...state.data, ...newEntities],
					};
				});
			},
			reset: () => {
				set({
					data: [],
				});
			},
		};
	});

interface LocalStorageLinksStore {
	links: Record<string, string>;
	add: (id: string, hash: string) => any;
	remove: (id: string) => any;
}
export const useLinksStore = create(
	persist<LocalStorageLinksStore>(
		(set, get) => ({
			links: {},
			add: (id, hash) => {
				set((state) => {
					return {
						links: {
							...state.links,
							[id]: hash,
						},
					};
				});
			},
			remove: (id) => {
				set((state) => {
					delete state.links[id];
					return state;
				});
			},
		}),
		{
			name: LocalStorageKeyName,
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),
);
