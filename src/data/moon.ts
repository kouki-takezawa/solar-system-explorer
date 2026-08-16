import type { OrbitalElements } from '../lib/orbitalMechanics';
import type { Entity } from '../types';

/** Real mean geocentric orbital elements (a in AU) -- used only to derive the
 *  Moon's *angular* position/phase relative to Earth; its rendered distance
 *  from Earth is exaggerated for visibility (see MOON_VISUAL_ORBIT_RADIUS). */
export const MOON_ELEMENTS: OrbitalElements = {
  a: 0.00257,
  e: 0.0549,
  i: 5.145,
  om: 125.08,
  w: 318.15,
  m0: 115.3654,
  periodDays: 27.321661,
};

export const MOON_SCENE_RADIUS = 0.17;
export const MOON_VISUAL_ORBIT_RADIUS = 1.7;
export const MOON_TEXTURE_URL = 'https://threejs.org/examples/textures/planets/moon_1024.jpg';

export const MOON_ENTITY: Entity = {
  id: 'moon',
  nameJa: '月',
  nameEn: 'The Moon',
  color: '#c9c9c9',
  description:
    '地球唯一の自然衛星。地球からの潮汐力により自転と公転の周期が一致した「潮汐固定」状態にあり、常に同じ面を地球に向けている。',
  facts: [
    { label: '直径', value: '3,474 km' },
    { label: '地球からの平均距離', value: '約 384,400 km' },
    { label: '公転周期', value: '約 27.3 日（恒星月）' },
    { label: '自転', value: '公転と同期（潮汐固定）' },
  ],
};
